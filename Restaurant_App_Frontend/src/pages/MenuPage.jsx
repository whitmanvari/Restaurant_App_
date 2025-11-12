import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../store/slices/categorySlice";
import { fetchProducts } from "../store/slices/productSlice";

function MenuPage() {
    const dispatch = useDispatch();
    //reduc stateinden hem kategori hem ürünleri okuma
    const {categories, status: categoryStatus} = useSelector((state) => state.categories);
    const {products, status: productStatus} = useSelector((state) => state.products);

    useEffect(() => {
        if(categoryStatus==='idle'){
            dispatch(fetchCategories());
        }
        if(productStatus==='idle'){
            dispatch(fetchProducts());
        }
    }, [categoryStatus, productStatus, dispatch]);

    if(productStatus === 'loading' || categoryStatus === 'loading') {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Yükleniyor...</span>
                </div>
            </div>
        );
    }

 return (
    <div>
      <h1 className="mb-4">Menümüz</h1>
      
      <div className="mb-4">
        <h4>Kategoriler</h4>
        <div className="list-group list-group-horizontal-sm overflow-auto">
          <button 
            type="button" 
            className="list-group-item list-group-item-action active"
            onClick={() => dispatch(fetchProducts())} // "Tümü" butonu
          >
            Tümü
          </button>
          {categories.map((category) => (
            <button 
              type="button" 
              key={category.id}
              className="list-group-item list-group-item-action"
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <h4>Ürünler</h4>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.map((product) => (
          <div className="col" key={product.id}>
            <div className="card h-100">
              <img 
                src={product.imageUrls[0] || 'https://via.placeholder.com/150'} 
                className="card-img-top" 
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">{product.description}</p>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center">
                <span className="text-success fw-bold">{product.price} TL</span>
                <button className="btn btn-primary btn-sm">Sepete Ekle</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuPage;