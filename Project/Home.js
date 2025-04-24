import { useState } from 'react';

const AnimeGANHomePage = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [animeImage, setAnimeImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target.result);
        setAnimeImage(null); // Clear previous anime image
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image conversion
  const handleConversion = async () => {
    if (!originalImage) {
      setError("Please upload an image first");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append('image', document.getElementById('file-upload').files[0]);
  
      const response = await fetch('http://localhost:5000/animegan', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      setAnimeImage(data.image_url);
    } catch (err) {
      console.error("Error during conversion:", err);
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  

  // Custom SVG icons
  const CloudUploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
      <path d="M12 12v9"></path>
      <path d="m16 16-4-4-4 4"></path>
    </svg>
  );
  
  const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
      <circle cx="12" cy="13" r="3"></circle>
    </svg>
  );
  
  const FlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
    </svg>
  );
  
  const SecurityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
  
  const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );
  
  const LoadingSpinner = () => (
    <svg className="spinner" viewBox="0 0 50 50">
      <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
    </svg>
  );

  return (
    <div className="anime-gan-app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="title">AnimeGAN</h1>
          <h2 className="subtitle">Transform your photos into anime portraits</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-container">
        <div className="upload-container">
          {/* File Upload Section */}
          <div className="upload-section">
            <label htmlFor="file-upload" className="upload-label">
              {originalImage ? (
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="preview-image"
                />
              ) : (
                <div className="upload-placeholder">
                  <CloudUploadIcon />
                  <p className="upload-text">
                    Click to upload an image
                    <span className="upload-subtext">or drag and drop</span>
                  </p>
                </div>
              )}
              <input 
                id="file-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Convert Button */}
          <div className="button-container">
            <button
              className={`transform-button ${isLoading ? 'loading' : ''} ${!originalImage ? 'disabled' : ''}`}
              onClick={handleConversion}
              disabled={!originalImage || isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span>Generating Anime Portrait...</span>
                </>
              ) : (
                'Transform to Anime'
              )}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>

          {/* Results Display */}
          {animeImage && (
            <div className="results-container">
              <div className="result-item">
                <h3 className="result-title">Original Photo</h3>
                <img src={originalImage} alt="Original" className="result-image" />
              </div>
              <div className="result-item">
                <h3 className="result-title">Anime Portrait</h3>
                <img src={animeImage} alt="Anime Portrait" className="result-image anime-image" />
                <a 
                  href={animeImage}
                  download="anime-portrait.jpg"
                  className="download-button"
                >
                  <DownloadIcon /> Download
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon-container">
              <CameraIcon />
            </div>
            <h3 className="feature-title">High Quality Conversion</h3>
            <p className="feature-description">
              Our advanced AI model produces stunning anime portraits with exceptional detail.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <FlashIcon />
            </div>
            <h3 className="feature-title">Lightning Fast</h3>
            <p className="feature-description">
              Get your anime portraits in seconds with our optimized processing engine.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-container">
              <SecurityIcon />
            </div>
            <h3 className="feature-title">Privacy Protected</h3>
            <p className="feature-description">
              Your images are processed securely and never stored on our servers.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 AnimeGAN Project. All rights reserved.</p>
      </footer>

      {/* CSS Styles */}
      <style jsx>{`
        /* Global styles */
        .anime-gan-app {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #303f9f 0%, #7b1fa2 100%);
          color: #ffffff;
          margin: 0;
          padding: 0;
        }

        /* Header styles */
        .header {
          padding: 24px 0;
          text-align: center;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 8px;
          margin-top: 0;
        }

        .subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 300;
          margin-top: 0;
        }

        /* Main container styles */
        .main-container {
          flex: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px 48px;
          width: 100%;
          box-sizing: border-box;
        }

        .upload-container {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 48px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        /* Upload area styles */
        .upload-section {
          margin-bottom: 32px;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 500px;
          height: 250px;
          border: 2px dashed rgba(255, 255, 255, 0.5);
          border-radius: 8px;
          cursor: pointer;
          margin: 0 auto;
          transition: all 0.3s ease;
        }

        .upload-label:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .upload-text {
          text-align: center;
          color: rgba(255, 255, 255, 0.9);
          margin-top: 16px;
          font-size: 1.1rem;
        }

        .upload-subtext {
          display: block;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 4px;
        }

        .preview-image {
          max-height: 240px;
          max-width: 100%;
          object-fit: contain;
          border-radius: 4px;
        }

        /* Button styles */
        .button-container {
          text-align: center;
          margin-bottom: 32px;
        }

        .transform-button {
          background-color: #7c4dff;
          color: white;
          border: none;
          padding: 12px 32px;
          font-size: 16px;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 200px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .transform-button:hover:not(:disabled) {
          transform: scale(1.05);
          background-color: #651fff;
        }

        .transform-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .transform-button.loading {
          opacity: 0.8;
        }

        .spinner {
          animation: rotate 2s linear infinite;
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }

        .path {
          stroke: white;
          stroke-linecap: round;
          animation: dash 1.5s ease-in-out infinite;
        }

        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }

        .error-message {
          color: #ff5252;
          margin-top: 8px;
          font-size: 0.9rem;
        }

        /* Results styles */
        .results-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-top: 32px;
        }

        .result-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .result-title {
          font-size: 1.2rem;
          margin-bottom: 16px;
          font-weight: 500;
        }

        .result-image {
          max-height: 320px;
          max-width: 100%;
          object-fit: contain;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .anime-image {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .download-button {
          display: inline-flex;
          align-items: center;
          background-color: transparent;
          border: 1px solid rgba(255, 255, 255, 0.6);
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .download-button svg {
          margin-right: 6px;
        }

        .download-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Features styles */
        .features-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 64px;
        }

        .feature-card {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon-container {
          width: 64px;
          height: 64px;
          background-color: #9c27b0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .feature-title {
          font-size: 1.2rem;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .feature-description {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* Footer styles */
        .footer {
          text-align: center;
          padding: 24px 0;
          color: rgba(255, 255, 255, 0.7);
          background-color: rgba(0, 0, 0, 0.2);
          margin-top: auto;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .features-section {
            grid-template-columns: 1fr;
          }
          
          .results-container {
            grid-template-columns: 1fr;
          }
          
          .upload-label {
            height: 200px;
          }
          
          .title {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimeGANHomePage;