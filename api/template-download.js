import Stripe from 'stripe';
import { TEMPLATE_BY_NAME } from './_template-catalog.js';

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
  const conditionName = typeof req.query.condition === 'string' ? req.query.condition.trim() : '';

  if (!sessionId || !conditionName) {
    return res.status(400).json({ error: 'Missing session_id or condition.' });
  }

  const template = TEMPLATE_BY_NAME.get(conditionName);
  if (!template) {
    return res.status(404).json({ error: 'Template not found.' });
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

    const selectedConditions = new Set(parseSelectedConditions(session.metadata.selected_conditions));
    if (!selectedConditions.has(conditionName)) {
      return res.status(403).json({ error: 'This template was not included in the purchase.' });
    }

    return res.redirect(302, `/product/pdfs/${encodeURIComponent(template.filename)}`);
  } catch (error) {
    console.error('Failed to authorize template download:', error);
    return res.status(500).json({ error: 'Unable to authorize this download right now.' });
  }
}
