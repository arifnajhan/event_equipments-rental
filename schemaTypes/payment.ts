// schemaTypes/payment.ts
import { defineField, defineType } from 'sanity'

const payment = defineType({  // Changed here - need to use defineType
    name: 'payment',
    title: 'Payment',
    type: 'document',
    fields: [
        defineField({
            name: 'user',
            title: 'User',
            type: 'reference',
            to: [{ type: 'user' }],
        }),
        defineField({
            name: 'booking',
            title: 'Booking',
            type: 'reference',
            to: [{ type: 'booking' }],
        }),
        defineField({
            name: 'amount',
            title: 'Amount',
            type: 'number',
        }),
        defineField({
            name: 'paymentMethod',
            title: 'Payment Method',
            type: 'string',
            options: {
                list: [
                    { title: 'Credit Card', value: 'card' },
                    { title: 'WhatsApp', value: 'whatsapp' },
                ],
            },
        }),
        defineField({
            name: 'paymentStatus',
            title: 'Payment Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Pending', value: 'pending' },
                    { title: 'Completed', value: 'completed' },
                    { title: 'Failed', value: 'failed' },
                ],
            },
        }),
        defineField({
            name: 'transactionDate',
            title: 'Transaction Date',
            type: 'datetime',
        }),
        defineField({
            name: 'paymentDetails',
            title: 'Payment Details',
            type: 'object',
            fields: [
                {
                    name: 'cardLast4',
                    title: 'Card Last 4 Digits',
                    type: 'string',
                },
                {
                    name: 'whatsappNumber',
                    title: 'WhatsApp Number',
                    type: 'string',
                },
            ],
        }),
    ],
});

export default payment;