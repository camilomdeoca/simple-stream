export default function SearchOptions({ changeOrderCallback }) {
  function changeCallback(changeEvent) {
    changeOrderCallback(changeEvent.target.value);
  }

  return (
    <div className="vertical-array">
      <p className="options-label">Order by:</p>
      <div className="horizontal-array">
        <label className="option">
          <input onChange={changeCallback} type="radio" name="order_type" value="date" defaultChecked />
          Last added
        </label>
        <label className="option">
          <input onChange={changeCallback} type="radio" name="order_type" value="name" />
          Alfabetic
        </label>
      </div>
    </div>
  );
}
