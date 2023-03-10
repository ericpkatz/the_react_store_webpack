import React from 'react';

const Products = (props)=> {
  const { users, products, increment, decrement, destroy  } = props;
  return (
    <ul>
      {
        products.map( product => {
          const user = users.find(user => user.id === product.userId);
          return (
            <li key={ product.id }> 
              { product.name } ({ product.rating })
              { user ? user.name : ''}
              <button onClick={ ()=> destroy(product) }>x</button>
              <button disabled={ product.rating <= 0} onClick={ ()=> decrement(product)}>-</button>
              <button disabled={ product.rating >= 10} onClick={ ()=> increment(product)}>+</button>
            </li>
          );
        })
      }
    </ul>
  );
}

export default Products;
