const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;

app.use(express.json());

// Webhook de Hotmart
app.post('/webhook/hotmart', async (req, res) => {
  try {
    const token = req.headers['x-hotmart-hottok'];
    if (HOTMART_TOKEN && token !== HOTMART_TOKEN) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    const { event, data } = req.body;
    const buyerEmail = data?.buyer?.email;
    const buyerName = data?.buyer?.name;

    console.log(`📩 Webhook Academia: ${event} - ${buyerEmail}`);

    if (event === 'PURCHASE_APPROVED' || event === 'PURCHASE_COMPLETE') {
      // Activar usuario en Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          email: buyerEmail,
          name: buyerName,
          active: true,
          enrolled_at: new Date().toISOString()
        }, { onConflict: 'email' });

      if (error) console.error('Error Supabase:', error);
      else console.log(`✅ Usuario activado en Academia: ${buyerEmail}`);
    }

    if (event === 'SUBSCRIPTION_CANCELLATION') {
      const { error } = await supabase
        .from('profiles')
        .update({ active: false })
        .eq('email', buyerEmail);

      if (error) console.error('Error Supabase:', error);
      else console.log(`❌ Usuario desactivado: ${buyerEmail}`);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error webhook:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok', app: 'Academia MAJHO' }));

// Servir frontend React
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌸 Academia MAJHO corriendo en puerto ${PORT}`);
});
