import '../spec_helper';
import CustomRecorder from '../../lib/custom_recorder';

describe('CustomRecorder', () => {
  let recorder, logOutput;

  beforeEach(() => {
    const mockRecord = {
      traceId: {
        traceId: 'some-trace-id',
        spanId: 'some-span-id',
        parentId: 'some-parent-span-id'
      },
      annotation: 'some-log-message'
    };

    const mockLogger = (logLine) => {
      logOutput = logLine;
    };

    recorder = new CustomRecorder(mockLogger);
    recorder.record(mockRecord);
  });

  it('logs message with trace ids', () => {
    expect(logOutput).toEqual('[some-parent-span-id,some-trace-id,some-span-id,true] some-log-message');
  });
});