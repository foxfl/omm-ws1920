import React from "react";
import { CustomizedMeme } from "./mememuc";
import "./mememuc-history.css";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/DeleteForever";
interface HistoryProps {
  // TODO: props use to pass savedMemes
  savedMemes: CustomizedMeme[];
  onDeleteSavedMeme(meme: CustomizedMeme): void;
  onRestoreMeme(meme: CustomizedMeme): void;
}

// The MemeMUCHistoryComponent is a horizontal bar located
// at the webpage bottom
const OmmMemeMUCHistory: React.FC<HistoryProps> = ({
  savedMemes,
  onDeleteSavedMeme,
  onRestoreMeme
}) => {
  // TODO: this property should contain all saved memes, which already
  // exists in the same-named parent component's property.

  return (
    <div className="history-container">
      <h4>My Favorite Memes</h4>
      <div className="meme-history">
        {savedMemes.map((meme, index) => (
          <div key={index} className="a-meme-history-item">
            <img
              onClick={() => onRestoreMeme(meme)}
              src={meme.link.toString()}
              alt={`history-${meme.baseMeme.name}`}
            />
            <IconButton
              id="mat-icon"
              aria-label="delete"
              onClick={() => onDeleteSavedMeme(meme)}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
        {/* 
        TODO: each saved meme should be rendered as div container 
              containing an img tag (the meme itself) and a mat-icon 
              tag (delete icon)
        TODO: use the css class a-meme-history-item for a meme's 
              container in order to apply the provided styling */}
      </div>
    </div>
  );
};

export default OmmMemeMUCHistory;
