import React from 'react';

const { useState } = React;

const ProductForm = ({ create, users })=> {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  const _create = async(ev)=> {
    try {
      ev.preventDefault();
      const product = { name, userId };
      await create(product);
      setName('');
      setUserId('');
      setError('');
    }
    catch(ex){
      setError(ex.response.data.error.errors[0].message);
    }
  };

  return (
    <form onSubmit={ _create }>
      { error }
      <input value={ name } onChange={ ev => setName(ev.target.value)}/>
      <select value={ userId } onChange={ ev => setUserId(ev.target.value )}>
        <option value=''>-- choose a user --</option>
        {
          users.map( user => {
            return (
              <option value={ user.id } key={ user.id }>{ user.name }</option>
            );
          })
        }
      </select>
      { userId }
      <button disabled={ !name || !userId }>Create A Product</button>
    </form>
  );
};

export default ProductForm;

