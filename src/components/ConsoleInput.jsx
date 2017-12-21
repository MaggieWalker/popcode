import bindAll from 'lodash/bindAll';
import isNil from 'lodash/isNil';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
  createAceEditor,
  createAceSessionWithoutWorker,
  inheritFontStylesFromParentElement,
} from '../util/ace';

export default class ConsoleInput extends Component {
  constructor() {
    super();
    bindAll(this, '_ref');
  }

  componentDidMount() {
    this._focusRequestedLine(this.props.requestedFocusedLine);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isTextSizeLarge !== this.props.isTextSizeLarge) {
      requestAnimationFrame(() => {
        inheritFontStylesFromParentElement(this._editor);
      });
    }
    this._focusRequestedLine(nextProps.requestedFocusedLine);
  }

  _focusRequestedLine(requestedFocusedLine) {
    if (get(requestedFocusedLine, 'language') !== 'console') {
      return;
    }

    this._editor.moveCursorTo(
      requestedFocusedLine.line,
      requestedFocusedLine.column,
    );

    this._editor.navigateLineEnd();
    this._editor.clearSelection();
    this._editor.focus();
    this.props.onRequestedLineFocused();
  }

  _ref(containerElement) {
    const {onInput} = this.props;

    if (containerElement) {
      const editor = this._editor = createAceEditor(containerElement);
      const session = createAceSessionWithoutWorker('javascript');
      editor.setSession(session);
      editor.renderer.setShowGutter(false);
      editor.moveCursorTo(0, 0);
      editor.setOptions({
        highlightActiveLine: false,
        maxLines: 1,
        minLines: 1,
      });
      editor.resize();
      editor.focus();

      session.on('change', ({action, lines}) => {
        if (action === 'insert' && lines.length === 2) {
          onInput(editor.getValue().replace('\n', ''));
          editor.setValue('', 0);
        }
      });
    } else if (!isNil(this._editor)) {
      this._editor.destroy();
    }
  }

  render() {
    return (
      <div
        className="console__input"
        ref={this._ref}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={e => e.stopPropagation()}
      />
    );
  }
}

ConsoleInput.propTypes = {
  isTextSizeLarge: PropTypes.bool,
  requestedFocusedLine: PropTypes.object,
  onInput: PropTypes.func.isRequired,
  onRequestedLineFocused: PropTypes.func.isRequired,
};

ConsoleInput.defaultProps = {
  requestedFocusedLine: null,
  isTextSizeLarge: false,
};
