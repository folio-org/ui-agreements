import focusByIdWhenReady from './focusByIdWhenReady';

describe('focusByIdWhenReady', () => {
  let pendingCallbacks;

  beforeEach(() => {
    pendingCallbacks = [];

    global.requestAnimationFrame = jest.fn(cb => {
      pendingCallbacks.push(cb);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('focuses the element with the given id when ready', () => {
    const focus = jest.fn();

    jest.spyOn(document, 'getElementById').mockReturnValue({ focus });

    focusByIdWhenReady('test-id');

    pendingCallbacks.shift()();
    pendingCallbacks.shift()();

    expect(document.getElementById).toHaveBeenCalledWith('test-id');
    expect(focus).toHaveBeenCalledTimes(1);
  });

  test('does nothing if the element does not exist', () => {
    jest.spyOn(document, 'getElementById').mockReturnValue(null);

    focusByIdWhenReady('missing-id');

    pendingCallbacks.shift()();
    pendingCallbacks.shift()();

    expect(document.getElementById).toHaveBeenCalledWith('missing-id');
  });
});
