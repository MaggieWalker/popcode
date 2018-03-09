import React from 'react';
import PropTypes from 'prop-types';

export default function InstructionsEditor({instructions, onCancelEditing}) {
  return (
    <div className="instructions-editor">
      <div className="instructions-editor-menu">
        <button onClick={onCancelEditing}>Cancel</button>
      </div>
      <pre contentEditable>
        {instructions}
      </pre>
    </div>
  );
}

InstructionsEditor.propTypes = {
  instructions: PropTypes.string.isRequired,
  onCancelEditing: PropTypes.func.isRequired,
};
