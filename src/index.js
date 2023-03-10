import axios from 'axios';
import { faker } from '@faker-js/faker';
import React from 'react';
import ReactDOM from 'react-dom/client';

const { useState, useEffect } = React;
const App = ()=> {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(()=> {
    const fetchProducts = async()=> {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  const create = async(ev)=> {
    try {
      ev.preventDefault();
      const product = { name };
      const response = await axios.post('/api/products', product);
      setProducts([...products, response.data]);
      setName('');
      setError('');
    }
    catch(ex){
      setError(ex.response.data.error.errors[0].message);
    }
  };
  const createRandom = async(ev)=> {
    try {
      const product = { name: faker.commerce.product() };
      const response = await axios.post('/api/products', product);
      setProducts([...products, response.data]);
      setName('');
      setError('');
    }
    catch(ex){
      setError(ex.response.data.error.errors[0].message);
    }
  };

  const destroy = async(product)=> {
    await axios.delete(`/api/products/${product.id}`);
    setProducts(products.filter(_product => _product.id !== product.id ));
  };

  const increment = async(product)=> {
    const response = await axios.put(`/api/products/${product.id}`, {
      rating: product.rating + 1
    });
    product = response.data;
    setProducts(products.map(_product => {
      if(_product.id === product.id){
        return product;
      }
      return _product;
    }));
  };

  const decrement = async(product)=> {
    const response = await axios.put(`/api/products/${product.id}`, {
      rating: product.rating - 1
    });
    product = response.data;
    setProducts(products.map(_product => {
      if(_product.id === product.id){
        return product;
      }
      return _product;
    }));
  };


  return (
    <div>
      <h1>
        Welcome to the React Store ({ products.length })
      </h1>
      <form onSubmit={ create }>
        { error }
        <input value={ name } onChange={ ev => setName(ev.target.value)}/>
        <button disabled={ !name }>Create A Product</button>
      </form>
      <button onClick={ createRandom }>Create Random Product</button>
      <ul>
        {
          products.map( product => {
            return (
              <li key={ product.id }> 
                { product.name } ({ product.rating })
                <button onClick={ ()=> destroy(product) }>x</button>
                <button disabled={ product.rating <= 0} onClick={ ()=> decrement(product)}>-</button>
                <button disabled={ product.rating >= 10} onClick={ ()=> increment(product)}>+</button>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<App />);
