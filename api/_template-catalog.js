export const TEMPLATE_CATALOG = [
  { name: 'Ankle Pain (Limitation of Motion)', dc: 'DC 5271', filename: 'Ankle_Pain_Evidence_Log_Template.pdf' },
  { name: 'Anxiety & Depression', dc: 'DC 9400 series', filename: 'Anxiety_Depression_Evidence_Log_Template.pdf' },
  { name: 'Asthma', dc: 'DC 6602', filename: 'Asthma_Evidence_Log_Template.pdf' },
  { name: 'Back Condition (Degenerative Arthritis/Strain)', dc: '38 CFR § 4.71a', filename: 'Back_Condition_Evidence_Log_Template.pdf' },
  { name: 'Eczema & Skin Conditions', dc: 'DC 7806', filename: 'Eczema_Skin_Evidence_Log_Template.pdf' },
  { name: 'Elbow Pain & Tendonitis', dc: 'DC 5206', filename: 'Elbow_Pain_Evidence_Log_Template.pdf' },
  { name: 'Eye Conditions', dc: 'DC 6000 series', filename: 'Eye_Conditions_Evidence_Log_Template.pdf' },
  { name: 'Flat Feet (Pes Planus)', dc: 'DC 5276', filename: 'Pes_Planus_Evidence_Log_Template.pdf' },
  { name: 'GERD (Acid Reflux)', dc: 'DC 7346', filename: 'GERD_Evidence_Log_Template.pdf' },
  { name: 'Hip Pain (Limitation of Motion)', dc: 'DC 5250-5255', filename: 'Hip_Pain_Evidence_Log_Template.pdf' },
  { name: 'Hypertension (High Blood Pressure)', dc: 'DC 7101', filename: 'Hypertension_Evidence_Log_Template.pdf' },
  { name: 'IBS (Irritable Bowel Syndrome)', dc: 'DC 7319', filename: 'IBS_Evidence_Log_Template.pdf' },
  { name: 'Knee Pain (Limitation of Motion)', dc: 'DC 5260/5261', filename: 'Knee_Pain_Evidence_Log_Template.pdf' },
  { name: 'Migraines (Headaches)', dc: 'DC 8100', filename: 'Migraines_Evidence_Log_Template.pdf' },
  { name: 'Neck Pain (Cervical Strain)', dc: 'DC 5237', filename: 'Neck_Pain_Evidence_Log_Template.pdf' },
  { name: 'Peripheral Neuropathy', dc: 'DC 8520-8720', filename: 'Peripheral_Neuropathy_Evidence_Log_Template.pdf' },
  { name: 'Plantar Fasciitis', dc: 'DC 5269', filename: 'Plantar_Fasciitis_Evidence_Log_Template.pdf' },
  { name: 'PTSD (Post-Traumatic Stress)', dc: 'DC 9411', filename: 'PTSD_Evidence_Log_Template.pdf' },
  { name: 'Radiculopathy (Sciatica/Nerve Pain)', dc: 'DC 8520/8620', filename: 'Radiculopathy_Evidence_Log_Template.pdf' },
  { name: 'Shoulder Pain (Limitation of Motion)', dc: 'DC 5201', filename: 'Shoulder_Pain_Evidence_Log_Template.pdf' },
  { name: 'Sinusitis & Rhinitis', dc: 'DC 6510/6522', filename: 'Sinusitis_Rhinitis_Evidence_Log_Template.pdf' },
  { name: 'Sleep Apnea', dc: 'DC 6847', filename: 'Sleep_Apnea_Evidence_Log_Template.pdf' },
  { name: 'TBI (Traumatic Brain Injury)', dc: 'DC 8045', filename: 'TBI_Evidence_Log_Template.pdf' },
  { name: 'Tinnitus (Ringing in Ears)', dc: 'DC 6260', filename: 'Tinnitus_Evidence_Log_Template.pdf' },
  { name: 'TMJ / TMD (Jaw Pain)', dc: 'DC 9905', filename: 'TMJ_TMD_Evidence_Log_Template.pdf' },
  { name: "Vertigo & Meniere's", dc: 'DC 6204/6205', filename: 'Vertigo_Evidence_Log_Template.pdf' },
  { name: 'Wrist / Carpal Tunnel', dc: 'DC 5215/8515', filename: 'Wrist_Carpal_Tunnel_Evidence_Log_Template.pdf' },
];

export const TEMPLATE_BY_NAME = new Map(
  TEMPLATE_CATALOG.map((template) => [template.name, template]),
);

export const PACK_PRICING = {
  1: 2900,
  2: 5000,
  3: 6000,
};

export function normalizeSelectedConditions(selectedConditions) {
  if (!Array.isArray(selectedConditions)) return [];

  const uniqueNames = [];
  const seen = new Set();

  for (const rawName of selectedConditions) {
    if (typeof rawName !== 'string') continue;
    const name = rawName.trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    uniqueNames.push(name);
  }

  return uniqueNames;
}

export function getSelectedTemplates(selectedConditions) {
  const normalizedNames = normalizeSelectedConditions(selectedConditions);
  return normalizedNames.map((name) => TEMPLATE_BY_NAME.get(name)).filter(Boolean);
}
