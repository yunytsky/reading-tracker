const Verification = () => {
    
    const onInputHandler = (e) => {
        if (e.target.value.length > 1){
            e.target.value = e.target.value.slice(0, 1);
        }

        if(e.target.id !== "last-verification-input"){
            e.target.nextSibling.focus();
        }
    }

    return (
      <div className="verification">
        <h3>Check your email</h3>
        <p>
          Code has been sent to example@gmail.com. Enter below to verify account
        </p>
        <div className="verification-inputs">
          <input
            type="number"
            onInput={(e) => {onInputHandler(e)}}
            className="verification-input"
          />
          <input
            type="number"
            onInput={(e) => {onInputHandler(e)}}
            className="verification-input"
          />
          <input
            type="number"
            onInput={(e) => {onInputHandler(e)}}
            className="verification-input"
          />
          <input
            type="number"
            onInput={(e) => {onInputHandler(e)}}
            className="verification-input"
          />
          <input
            type="number"
            onInput={(e) => {onInputHandler(e)}}
            className="verification-input"
          />
          <input
            type="number"
            onInput={(e) => {onInputHandler(e)}}
            className="verification-input"
            id="last-verification-input"
          />
        </div>
      </div>
    );
}

export default Verification;
