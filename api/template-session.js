import Stripe from 'stripe';
import { getSelectedTemplates } from './_template-catalog.js';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not set');
  return new Stripe(key, { apiVersion: '2023-10-16' });
}

function parseSelectedConditions(metadataValue) {
  if (typeof metadataValue !== 'string' || !metadataValue.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(metadataValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sessionId = typeof req.query.session_id === 'string' ? req.query.session_id.trim() : '';
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session_id.' });
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed.' });
    }

    if (session.metadata?.product_type !== 'template_bundle') {
      return res.status(403).json({ error: 'This session is not valid for template downloads.' });
    }

    const selectedTemplates = getSelectedTemplates(
      parseSelectedConditions(session.metadata.selected_conditions),
    );

    if (selectedTemplates.length === 0) {
      return res.status(404).json({ error: 'No templates were found for this purchase.' });
    }

    return res.status(200).json({
      sessionId,
      customerEmail: session.customer_details?.email || '',
      packSize: Number(session.metadata.pack_size || selectedTemplates.length),
      templates: selectedTemplates.map((template) => ({
        ...template,
        downloadUrl: `/api/template-download?session_id=${encodeURIComponent(sessionId)}&condition=${encodeURIComponent(template.name)}`,
      })),
    });
  } catch (error) {
    console.error('Failed to verify template session:', error);
    return res.status(500).json({ error: 'Unable to verify this purchase right now.' });
  }
}
