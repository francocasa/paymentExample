import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { z } from 'zod';

// Define el esquema de validación
const paymentSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  paymentMethod: z.object({
    id: z.string(),
  }),
});

const CheckoutForm = ({ totalAmount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    try {
      paymentSchema.parse({ email, amount: totalAmount, paymentMethod });
    } catch (e) {
      setErrorMessage(e.errors[0].message);
      return;
    }

    // Enviar la solicitud al backend
    const payload = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalAmount,
        paymentMethod: { id: paymentMethod.id },
        userEmail: email,
      }),
    };

    const response = await fetch(
      'http://localhost:8080/api/checkouts',
      payload
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData);
    } else {
      const data = await response.json();
      console.log(data);
    }

    onPaymentSuccess();
    setSuccessMessage('¡Gracias por tu compra!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <CardElement />
      {errorMessage && <div className="error">{errorMessage}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <button type="submit">Pay</button>
    </form>
  );
};

export default CheckoutForm;
