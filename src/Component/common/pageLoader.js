import React from 'react';

const PageLoader = () => {
  return (
    <div className='bc_loader_box'>
      <div className='bc_loader_box_div'>
        <div className="card-content">
          <div className="loader-1">
            <div className="pulse-container">
              <div className="pulse-circle"></div>
              <div className="pulse-circle"></div>
              <div className="pulse-circle"></div>
            </div>
          </div>
        </div>
        <img alt='' src='./images/logo/DarkLogo.svg'></img>
        <h6>PixaScore created by PixelNX-FZCO</h6>
      </div>
    </div>
  );
};

export default PageLoader;