import React from 'react';

const ItemCart = (props) => {
  const { item } = props;
  const { name, price, quantity = 1, img } = item;

  return (
    <li className="clearfix">
      <img
        src={img}
        alt={`product ${name}`}
        style={{ width: '70px', height: '70px' }}
      />
      <span className="item-name">{name}</span>
      <span className="item-price">${price.toFixed(2)}</span>
      <span className="item-quantity">Quantity: {quantity}</span>
    </li>
  );
};

export default ItemCart;
