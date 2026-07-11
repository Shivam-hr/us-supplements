import { Resend } from 'resend'

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.error('RESEND_API_KEY missing — skipping order confirmation email')
    // Never fail the whole request just because email isn't configured yet —
    // the order itself already saved successfully before this route was called.
    return Response.json({ skipped: true, reason: 'Resend not configured' })
  }

  try {
    const {
      orderId = 'N/A',
      toEmail,
      fullName = 'there',
      address = 'N/A',
      total = 0,
      paymentMethod = 'N/A',
      items = [],
    } = await request.json()

    if (!toEmail) {
      console.error('No customer email provided — skipping confirmation email')
      return Response.json({ skipped: true, reason: 'No recipient email' })
    }

    const resend = new Resend(apiKey)

    const itemsRows = items
      .map(item => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;">${item.name} x${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;text-align:right;">₹${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`)
      .join('')

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#161616;">
        <div style="background:#101214;padding:24px;border-radius:16px 16px 0 0;">
          <span style="color:#B7FF1E;font-weight:900;font-size:20px;">US SUPPLEMENTS</span>
        </div>
        <div style="background:#ffffff;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 16px 16px;padding:28px;">
          <h2 style="margin-top:0;">Thank you for your order, ${fullName}! 🎉</h2>
          <p style="color:#6B7280;">Your order <strong>#${orderId}</strong> has been placed successfully.</p>

          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            ${itemsRows}
          </table>

          <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:16px;border-top:2px solid #101214;padding-top:12px;">
            Total: ₹${total.toLocaleString()}
          </div>

          <p style="margin-top:20px;"><strong>Payment method:</strong> ${paymentMethod}</p>
          <p><strong>Delivery address:</strong><br/>${address}</p>

          <p style="margin-top:24px;color:#6B7280;font-size:13px;">
            You can track your order anytime at
            <a href="https://ussuppliments.netlify.app/track-order" style="color:#101214;">ussuppliments.netlify.app/track-order</a>.
          </p>
        </div>
        <p style="text-align:center;color:#9CA3AF;font-size:12px;margin-top:16px;">
          US Supplements • This is an automated confirmation email.
        </p>
      </div>
    `

    const { error } = await resend.emails.send({
      from: 'US Supplements <onboarding@resend.dev>', // swap for a verified domain sender once you set one up in Resend
      to: toEmail,
      subject: `Order Confirmed — #${orderId}`,
      html,
    })

    if (error) {
      console.error('Resend email failed:', error.message || error)
      return Response.json({ sent: false, error: error.message }, { status: 200 })
    }

    return Response.json({ sent: true })
  } catch (err) {
    console.error('Order confirmation email failed:', err.message)
    return Response.json({ sent: false, error: err.message }, { status: 200 })
  }
}