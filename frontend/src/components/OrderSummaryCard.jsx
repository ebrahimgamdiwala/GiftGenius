export default function OrderSummaryCard({ items, subtotal, checkoutButton }) {
  const shipping = subtotal > 50 ? 0 : 5.99
  const total = subtotal + shipping

  return (
    // Apply consistent theme styling: white background, dark border, button shadow
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-dark shadow-button">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-dark">Order Summary</h2>

        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <div>
                {/* Ensure item name and quantity use dark text */}
                <span className="text-dark">{item.name}</span>
                <span className="text-dark/70 ml-2">x{item.quantity}</span>
              </div>
              <span className="text-dark font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dark/20 pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-dark">Subtotal</span>
            <span className="text-dark">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark">Shipping</span>
            <span className="text-dark">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-dark/20">
            <span className="text-dark">Total</span>
            <span className="text-dark">${total.toFixed(2)}</span>
          </div>
        </div>

        {checkoutButton && <div className="mt-6">{checkoutButton}</div>}
      </div>
    </div>
  )
}
