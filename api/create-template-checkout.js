import Stripe from 'stripe';
import {
  PACK_PRICING,
  getSelectedTemplates,
  normalizeSelectedConditions,
} from './_template-catalog.js';

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY not set');
  return new Stripe(key, { apiVersion: '2023-10-16' });
}

function getBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  if (!host) throw new Error('Request host missing');
  return `${proto}://${host}`;
}

function getCancelUrl(baseUrl, cancelPath) {
  const fallback = new URL('/products.html#bundle-builder', baseUrl);
  if (typeof cancelPath !== 'string' || !cancelPath.startsWith('/')) {
    return fallback.toString();
  }

  try {
    return new URL(cancelPath, baseUrl).toString();
  } catch {
    return fallback.toString();
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { selectedConditions, cancelPath } = req.body || {};
    const normalizedNames = normalizeSelectedConditions(selectedConditions);
    const selectedTemplates = getSelectedTemplates(normalizedNames);
    const packSize = selectedTemplates.length;

    if (packSize < 1 || packSize > 3) {
      return res.status(400).json({ error: 'Select between 1 and 3 templates.' });
    }

    if (selectedTemplates.length !== normalizedNames.length) {
      return res.status(400).json({ error: 'One or more selected templates are invalid.' });
    }

    const unitAmount = PACK_PRICING[packSize];
    if (!unitAmount) {
      return res.status(400).json({ error: 'Invalid bundle size.' });
    }

    const baseUrl = getBaseUrl(req);
    const successUrl = `${baseUrl}/product/download.html?session_id={CHECKOUT_SESSION_ID}`;
    const stripe = getStripe();
    const templateNames = selectedTemplates.map((template) => template.name);
    const metadata = {
      product_type: 'template_bundle',
      pack_size: String(packSize),
      selected_conditions: JSON.stringify(templateNames),
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: getCancelUrl(baseUrl, cancelPath),
      billing_address_collection: 'auto',
      customer_creation: 'always',
      metadata,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packSize === 1 ? `${templateNames[0]} Template` : `${packSize}-Template Bundle`,
              description: templateNames.join(' | '),
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
    });

    if (!session.url) {
      throw new Error('Stripe checkout session did not return a URL.');
    }

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Failed to create template checkout session:', error);
    return res.status(500).json({ error: 'Unable to start checkout right now.' });
  }
}
