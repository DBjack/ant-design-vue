import Modal from '..';
import { asyncExpect } from '@/tests/utils';
const { confirm } = Modal;

describe('Modal.confirm triggers callbacks correctly', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  afterEach(() => {
    errorSpy.mockReset();
    document.body.innerHTML = '';
  });

  afterAll(() => {
    errorSpy.mockRestore();
  });

  function $$(className) {
    return document.body.querySelectorAll(className);
  }

  function open(args) {
    confirm({
      title: 'Want to delete these items?',
      content: 'some descriptions',
      ...args,
    });
  }

  it('trigger onCancel once when click on cancel button', () => {
    const onCancel = jest.fn();
    const onOk = jest.fn();
    open({
      onCancel,
      onOk,
    });
    // first Modal
    $$('.ant-btn')[0].click();
    expect(onCancel.mock.calls.length).toBe(1);
    expect(onOk.mock.calls.length).toBe(0);
  });

  it('trigger onOk once when click on ok button', () => {
    const onCancel = jest.fn();
    const onOk = jest.fn();
    open({
      onCancel,
      onOk,
    });
    // second Modal
    $$('.ant-btn-primary')[0].click();
    expect(onCancel.mock.calls.length).toBe(0);
    expect(onOk.mock.calls.length).toBe(1);
  });

  it('should allow Modal.comfirm without onCancel been set', () => {
    open();
    // Third Modal
    $$('.ant-btn')[0].click();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('should allow Modal.comfirm without onOk been set', () => {
    open();
    // Fourth Modal
    $$('.ant-btn-primary')[0].click();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('ok only', () => {
    open({ okCancel: false });
    expect($$('.ant-btn')).toHaveLength(1);
    expect($$('.ant-btn')[0].innerHTML).toContain('OK');
  });

  it('allows extra props on buttons', () => {
    open({
      okButtonProps: { props: { disabled: true } },
      cancelButtonProps: { attrs: { 'data-test': 'baz' } },
    });
    expect($$('.ant-btn')).toHaveLength(2);
    expect($$('.ant-btn')[0].attributes['data-test'].value).toBe('baz');
    expect($$('.ant-btn')[1].disabled).toBe(true);
  });

  it('trigger onCancel once when click on cancel button', () => {
    jest.useFakeTimers();
    ['info', 'success', 'warning', 'error'].forEach(async type => {
      Modal[type]({
        title: 'title',
        content: 'content',
      });
      expect($$(`.ant-modal-confirm-${type}`)).toHaveLength(1);
      $$('.ant-btn')[0].click();
      jest.runAllTimers();
      await asyncExpect(() => {
        expect($$(`.ant-modal-confirm-${type}`)).toHaveLength(0);
      });
    });
    jest.useRealTimers();
  });
});
