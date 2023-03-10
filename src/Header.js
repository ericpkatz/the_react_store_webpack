import React from 'react';

const Header = ({ products })=> {
  return (
    <h1>
      Welcome to the React Store ({ products.length })
    </h1>
  );
}

export default Header;
