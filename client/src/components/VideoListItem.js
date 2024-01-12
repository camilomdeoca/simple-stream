export default function VideoListItem({
  title,
  thumbnail,
  duration,
  quality,
  url,
  formatState,
  transcodeProgress,
  requestTranscodeCallback,
}) {
  let info = undefined;
  if (formatState === "needs-transcode") {
    info = (<p className="warning-text video-list-item-text">Needs Conversion</p>);
  } else if (formatState === "transcoded") {
    info = (<p className="warning-text video-list-item-text">Transcoded</p>);
  } else if (formatState === "transcoding") {
    info = (<progress value={transcodeProgress}>Transcoding...</progress>);
  }

  const card = (
    <div className="video-list-item">
      <div className="horizontal-array expand">
        <img className="video-list-item-preview-image" src={thumbnail} alt="" />
        <div className="vertical-array expand">
          <p className="video-list-item-text video-list-item-title">
            {title.replace(/\.[^/.]+$/, "")}
          </p>
          <div className="horizontal-array space-between">
            <p className="video-list-item-text video-list-item-info">{duration}</p>
            {info}
            <p className="video-list-item-text video-list-item-info">{quality}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (formatState === "needs-transcode") {
    return (
      <button onClick={requestTranscodeCallback} className="link-button no-decorations">
        {card}
      </button>
    );
  } else {
    return (
      <a draggable={false} href={url} className="no-decorations">
        {card}
      </a>
    );
  }
}
