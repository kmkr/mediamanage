const path = require("path");

const logger = require("../logger");
const finder = require("../../file-system/finder");
const append = require("../../file-system/file-appender");
const performerNames = require("../../performers/performer-name-list");
const { flatten, unique } = require("../../helpers/array-helper");
const existingMediaParser = require("../../helpers/existing-media-parser");

module.exports = vorpal =>
  new Promise(resolve => {
    const allVideos = finder.video({ recursive: true });
    const performerNamesFromVideos = allVideos
      .map(filePath => existingMediaParser.getPerformerNames(filePath))
      .reduce(flatten, [])
      .sort()
      .filter(unique);

    vorpal.activeCommand.prompt(
      {
        message: "Which names do you want to merge?",
        type: "checkbox",
        name: "mergeCandidates",
        choices: performerNamesFromVideos
      },
      ({ mergeCandidates }) => {
        if (mergeCandidates.length < 2) {
          logger.log("Merge canceled");
          return resolve();
        }

        vorpal.activeCommand.prompt(
          {
            message: "Which of the names do you want to use?",
            type: "list",
            name: "nameToUse",
            choices: mergeCandidates
          },
          ({ nameToUse }) => {
            if (!nameToUse) {
              logger.log("Merge canceled");
              return resolve();
            }

            const namesToMerge = mergeCandidates.filter(
              mergeCandidate => mergeCandidate !== nameToUse
            );

            const matchingVideos = finder
              .video({ recursive: true })
              .filter(filePath => {
                const performerNames = existingMediaParser.getPerformerNames(
                  filePath
                );
                return namesToMerge.some(nameToMerge =>
                  performerNames.includes(nameToMerge)
                );
              });

            if (!matchingVideos.length) {
              logger.log("No matching videos found. Merge canceled.");
              return resolve();
            }

            const moveStatements = matchingVideos.map(filePath => {
              const newFilePath = namesToMerge.reduce(
                (prevVal, curVal) =>
                  existingMediaParser.renamePerformerName({
                    filePath: prevVal,
                    fromName: curVal,
                    toName: nameToUse
                  }),
                filePath
              );

              return `mv "${filePath}" "${newFilePath}"`;
            });

            moveStatements.forEach(moveStatement => {
              logger.log(moveStatement);
            });

            performerNames.remove(namesToMerge);

            append(
              `${process.cwd()}${path.sep}move`,
              `\n${moveStatements.join("\n")}`
            );
          }
        );
      }
    );
  });
