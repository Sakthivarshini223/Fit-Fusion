import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import data from "../data/db.json";
import { client } from "@gradio/client";

const TryOnPage = () => {

  const { category, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState(null);
  const [combinedImage, setCombinedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let productList;

    switch (category) {
      case "women":
        productList = data.womenProducts;
        break;
        case "mens":
          productList=data.menProducts;
          break;
      case "kids":
        productList = data.kidsProducts;
        break;
      
      default:
        setError("Invalid product category.");
        navigate("/"); 
        return;
    }

   
    const foundProduct = productList.find(
      (p) => p.id === parseInt(productId)
    );

    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setError("Product not found.");
     
      navigate(`/${category}`);
    }
  
  }, [category, productId, navigate]);

 
  const getImageUrl = (imageName) => {
    if (!category) return ""; 
  
    const folderName = `${category.charAt(0).toUpperCase() + category.slice(1)}-image`;
    return `/${folderName}/${imageName}`;
  };

  const handleUserPhotoUpload = (event) => {
  
    const file = event.target.files[0];
    if (file) {
      setUserPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhotoPreview(reader.result);
        setCombinedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    
    if (!userPhotoFile) {
      setError("Please upload your photo first.");
      return;
    }
    console.log("My Hugging Face Token:", import.meta.env.VITE_HF_TOKEN);
    setLoading(true);
    setError(null);
    setCombinedImage(null);

    try {
      const productImageUrl = getImageUrl(product.image); 
      const productResponse = await fetch(productImageUrl);
      if (!productResponse.ok) {
        throw new Error(`Could not fetch product image from ${productImageUrl}.`);
      }
      const productBlob = await productResponse.blob();
      const app = await client("yisol/IDM-VTON", {
        hf_token: import.meta.env.VITE_HF_TOKEN,
      });
      const result = await app.predict("/tryon", [
        { background: userPhotoFile, layers: [], composite: null },
        productBlob,
        "A stylish piece of clothing",
        true,
        false,
        30,
        42,
      ]);
      setCombinedImage(result.data[0].url);
    } catch (err) {
      console.error(err);
      if (err.message && err.message.includes("quota")) {
        setError(
          "Error: You are out of API quota for this model. Please try again later."
        );
      } else {
        setError(err.message || "The AI server had an error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  

  if (error && !product) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }
  if (!product) {
    return (
      <div className="container mt-5 text-center">
        Loading product details...
      </div>
    );
  }

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Lobster&display=swap');
        body { font-family: 'Poppins', sans-serif; background-color: #f8f9fa; }
        .font-lobster { font-family: 'Lobster', cursive; }
        .brand-gradient { background: linear-gradient(to right, #ec4899, #8b5cf6); }
        .try-on-container { max-width: 900px; margin: 50px auto; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background-color: #fff; }
        .try-on-image-preview, .try-on-result-image {
          width: 100%;
          height: 300px;
          object-fit: contain;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-top: 15px;
          background-color: #f9f9f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #adb5bd;
        }
        .product-dress-image {
          width: 100%;
          max-height: 250px;
          object-fit: contain;
          border: 1px solid #eee;
          border-radius: 4px;
        }
        .card-header.bg-user-photo {
          background: linear-gradient(to right, #e75480, #c8a2c8);
          color: white;
        }
        .card-header.bg-dress-to-try {
          background: linear-gradient(to right, #c8a2c8, #e75480);
          color: white;
        }
        .btn-custom {
          background: linear-gradient(45deg, #e75480, #c8a2c8);
          color: white;
          border: none;
          padding: 12px 30px;
          font-size: 1.25rem;
          border-radius: 50px;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .btn-custom:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          color: white;
        }
        .btn-custom:disabled {
          background: #ccc !important;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
          color: #666;
        }
      `}</style>
      <div className="bg-light min-vh-100 d-flex flex-column">
        <nav className="navbar navbar-expand-lg navbar-dark brand-gradient shadow-sm py-2 sticky-top">
          <div className="container">
            <a
              className="navbar-brand fs-2 font-lobster"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              FitFusion
            </a>
          </div>
        </nav>

        <main className="flex-grow-1">
          <div className="try-on-container">
            <h2 className="text-center mb-4">
              Virtual Try-On for {product.name}
            </h2>

            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-header bg-user-photo text-white">
                    <h5 className="card-title mb-0">Your Photo</h5>
                  </div>
                  <div className="card-body text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUserPhotoUpload}
                      className="form-control mb-3"
                    />
                    {userPhotoPreview ? (
                      <img
                        src={userPhotoPreview}
                        alt="Your Uploaded"
                        className="try-on-image-preview img-fluid"
                      />
                    ) : (
                      <div className="try-on-image-preview">
                        Upload your photo here
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-6 mb-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-header bg-dress-to-try text-white">
                    <h5 className="card-title mb-0">Dress to Try</h5>
                  </div>
                  <div className="card-body text-center">
                    <img
                      src={getImageUrl(product.image)} // This now works for Kids!
                      alt={product.name}
                      className="product-dress-image img-fluid mb-3"
                    />
                    <p className="lead fw-bold">{product.name}</p>
                    <p className="text-muted">{product.price}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center my-4">
              <button
                className="btn btn-lg btn-custom"
                onClick={handleTryOn}
                disabled={!userPhotoFile || loading}
              >
                {loading ? "Processing..." : "Try On This Dress!"}
              </button>
            </div>

            {combinedImage && (
              <div className="mt-5 text-center">
                <h3>Your Virtual Try-On Result</h3>
                <img
                  src={combinedImage}
                  alt="Virtual Try-On Result"
                  className="try-on-result-image img-fluid"
                />
              </div>
            )}
            {error && (
              <div className="alert alert-danger mt-3 text-center">{error}</div>
            )}
          </div>
        </main>

        <footer className="bg-dark text-white mt-5 py-3">
          <div className="container text-center">
            <p>
              &copy; {new Date().getFullYear()} FitFusion. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default TryOnPage;