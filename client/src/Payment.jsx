import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CartList from './components/CartList';
import CheckoutForm from './components/CheckoutForm';
import { useAppContext } from './store';

const stripePromise = loadStripe(
  'pk_test_51QCrcLIYFcT1gpXszrAcB7urrQ2OK4wOLMXYTI7EzmIUrv2veHIdWVJ3FmbWcNySCwga03TtNlZANewJOi3DPKW300OYcsb1Oa'
);

const Payment = () => {
  const { state } = useAppContext();
  const totalAmount = state.cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const totalAmountInCents = Math.round(totalAmount * 100);

  const handlePaymentSuccess = () => {
    // Aquí puedes vaciar el carrito si es necesario
  };

  return (
    <div>
      <div className="container">
        <div>
          <h1>Product List</h1>
          <CartList />
        </div>
        <div>
          <h2>Total</h2>
          <h3>Price: ${totalAmount.toFixed(2)}</h3>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm
            totalAmount={totalAmountInCents}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
