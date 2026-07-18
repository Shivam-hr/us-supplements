import React from 'react'
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    color: '#161616',
    fontFamily: 'Helvetica',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    backgroundColor: '#C6FF1E',
    color: '#101214',
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginRight: 8,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#101214',
  },
  invoiceLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#101214',
  },
  invoiceMeta: {
    fontSize: 9,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionBlock: {
    width: '48%',
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 10,
    color: '#161616',
    marginBottom: 2,
    lineHeight: 1.4,
  },
  table: {
    marginTop: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#101214',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeaderCell: {
    color: '#C6FF1E',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  colItem: { width: '46%' },
  colQty: { width: '13%', textAlign: 'center' },
  colPrice: { width: '18%', textAlign: 'right' },
  colTotal: { width: '23%', textAlign: 'right' },
  summaryBlock: {
    marginTop: 16,
    alignSelf: 'flex-end',
    width: '45%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 10,
    color: '#161616',
    fontWeight: 'bold',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#101214',
    paddingTop: 8,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#101214',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#101214',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  badge: {
    fontSize: 8,
    color: '#161616',
    backgroundColor: '#F7F8FA',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginTop: 8,
  },
})

function InvoiceDocument({ order }) {
  const {
    orderId,
    fullName,
    email,
    phone,
    address,
    items = [],
    total = 0,
    deliveryCharge = 0,
    paymentMethod = 'N/A',
    orderDate,
  } = order

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <View style={styles.logoRow}>
              <Text style={styles.logoBadge}>US</Text>
              <Text style={styles.logoText}>SUPPLEMENTS</Text>
            </View>
            <Text style={{ fontSize: 8, color: '#6B7280', marginTop: 6 }}>
              100% Authentic Supplements, Sourced Directly from Brands
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceMeta}>Order #{orderId}</Text>
            <Text style={styles.invoiceMeta}>{orderDate}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bill to / Payment info */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Billed To</Text>
            <Text style={styles.sectionText}>{fullName}</Text>
            <Text style={styles.sectionText}>{email}</Text>
            {phone && <Text style={styles.sectionText}>{phone}</Text>}
          </View>
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Delivery Address</Text>
            <Text style={styles.sectionText}>{address}</Text>
            <Text style={[styles.sectionText, { marginTop: 6 }]}>
              Payment Method: {paymentMethod}
            </Text>
          </View>
        </View>

        {/* Items table */}
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.colItem]}>Item</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colPrice]}>Price</Text>
            <Text style={[styles.tableHeaderCell, styles.colTotal]}>Total</Text>
          </View>
          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colItem}>{item.name}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>Rs. {item.price?.toLocaleString('en-IN')}</Text>
              <Text style={styles.colTotal}>Rs. {(item.price * item.quantity)?.toLocaleString('en-IN')}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rs. {subtotal.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={styles.summaryValue}>
              {deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge.toLocaleString('en-IN')}`}
            </Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total Paid</Text>
            <Text style={styles.grandTotalValue}>Rs. {total.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>US Supplements • This is a computer-generated invoice and does not require a signature.</Text>
          <Text style={{ marginTop: 4 }}>For support, contact support@ussupplements.in or visit ussuppliments.netlify.app/support</Text>
        </View>
      </Page>
    </Document>
  )
}

// Generates the PDF and returns it as a Buffer, ready to attach to an email.
export async function generateInvoicePdf(order) {
  return renderToBuffer(<InvoiceDocument order={order} />)
}