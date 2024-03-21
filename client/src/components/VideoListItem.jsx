import { Link } from "react-router-dom";

export default function VideoListItem({
  title,
  thumbnail,
  duration,
  quality,
  url,
  linkToDetails,
  formatState,
  transcodeProgress,
  requestTranscodeCallback,
}) {
  let info = undefined;
  //if (formatState === "needs-transcode") {
  //  info = (<span className="warning-text video-list-item-text">Needs Conversion</span>);
  //} else
  if (formatState === "transcoded") {
    info = (<span className="warning-text video-list-item-text">Transcoded</span>);
  } else if (formatState === "transcoding") {
    info = (<progress value={transcodeProgress}>Transcoding...</progress>);
  }

  const buttonPlay = (
    <div className="video-list-item-button-container"><a href={url}><button className="video-list-item-button">Play</button></a></div>
  );

  const buttonTranscode = (
    <div className="video-list-item-button-container"><button className="video-list-item-button" onClick={requestTranscodeCallback}>Transcode</button></div>
  );

  const buttonDetails = (
    <div className="video-list-item-button-container"><button className="video-list-item-button"><Link to={linkToDetails}>Details</Link></button></div>
  );

  const card = (
    <div className="video-list-item">
      <div className="horizontal-array expand">
        <img className="video-list-item-preview-image" src={thumbnail} alt="" />
        <div className="vertical-array expand">
          <p className="video-list-item-text video-list-item-title">
            {title.replace(/\.[^/.]+$/, "")}
          </p>

          <div className="horizontal-array">
            <div className="horizontal-array space-between expand">
              <p className="video-list-item-text video-list-item-info">{info}</p>
              <p className="video-list-item-text video-list-item-info">Jan 10th, 2024</p>
            </div>
            {formatState === "needs-transcode" ? buttonTranscode : buttonPlay}
          </div>
          <div className="horizontal-array">
            <div className="horizontal-array space-between expand">
              <p className="video-list-item-text video-list-item-info">{duration}</p>
              <p className="video-list-item-text video-list-item-info">{quality}</p>
            </div>
            {buttonDetails}
          </div>
        </div>
      </div>
    </div>
  );

  return card;
}
