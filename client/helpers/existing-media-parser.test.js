const { getTitle, getPerformerNames } = require('./existing-media-parser');

test('single performerName', () => {
    const fileName = 'video.name_piglet.mp4';
    const performerNames = getPerformerNames(fileName);
    expect(performerNames).toEqual(['piglet']);
});

test('multiple performerNames without category', () => {
    const fileName = 'video.name_winnie.the.pooh_piglet.mp4';
    const performerNames = getPerformerNames(fileName);
    expect(performerNames).toEqual(['winnie.the.pooh', 'piglet']);
});

test('performerNames with category', () => {
    const fileName = 'video.name_winnie.the.pooh_piglet_[woz][wiz].mp4';
    const performerNames = getPerformerNames(fileName);
    expect(performerNames).toEqual(['winnie.the.pooh', 'piglet']);
});

test('performerNames when indexified without category', () => {
    const fileName = 'video.name_winnie.the.pooh_piglet_(12).mp4';
    const performerNames = getPerformerNames(fileName);
    expect(performerNames).toEqual(['winnie.the.pooh', 'piglet']);
});

test('title when only title', () => {
    const fileName = 'video.name.mp4';
    const title = getTitle(fileName);
    expect(title).toEqual('video.name');
});

test('title when performers', () => {
    const fileName = 'video.name_piglet.mp4';
    const title = getTitle(fileName);
    expect(title).toEqual('video.name');
});

test('title when performers and categories', () => {
    const fileName = 'video.name_piglet_[woz].mp4';
    const title = getTitle(fileName);
    expect(title).toEqual('video.name');
});
