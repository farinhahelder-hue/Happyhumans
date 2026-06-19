/**
 * Script d'audit Supabase pour Happy Humans
 * 
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_KEY=xxx node scripts/audit-supabase.js
 * 
 * Ou créer un fichier .env.local avec:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables SUPABASE_URL et SUPABASE_KEY requises');
  console.log('\nUsage:');
  console.log('  SUPABASE_URL=https://xxx.supabase.co SUPABASE_KEY=xxx node scripts/audit-supabase.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditSiteContent() {
  console.log('\n📋 AUDIT: site_content');
  console.log('═'.repeat(60));

  const keywords = ['voyage', 'carnet', 'hôtel', 'hotel', 'heldonica', 'destination', 'séjour', 'héberg'];

  for (const keyword of keywords) {
    const { data, error } = await supabase
      .from('site_content')
      .select('id, key, page, value')
      .ilike('value', `%${keyword}%`);

    if (error) {
      console.error(`❌ Erreur pour "${keyword}":`, error.message);
      continue;
    }

    if (data && data.length > 0) {
      console.log(`\n⚠️  Trouvé ${data.length} entrées avec "${keyword}":`);
      data.forEach(item => {
        console.log(`   - [${item.page}] ${item.key}`);
        const excerpt = item.value?.substring(0, 100) + (item.value?.length > 100 ? '...' : '');
        console.log(`     "${excerpt}"`);
      });
    } else {
      console.log(`✅ "${keyword}" - aucune occurrence`);
    }
  }
}

async function auditSiteSettings() {
  console.log('\n\n📋 AUDIT: site_settings');
  console.log('═'.repeat(60));

  const keywords = ['heldonica', 'voyage'];

  for (const keyword of keywords) {
    const { data, error } = await supabase
      .from('site_settings')
      .select('id, key, value')
      .ilike('value', `%${keyword}%`);

    if (error) {
      console.error(`❌ Erreur pour "${keyword}":`, error.message);
      continue;
    }

    if (data && data.length > 0) {
      console.log(`\n⚠️  Trouvé ${data.length} entrées avec "${keyword}":`);
      data.forEach(item => {
        console.log(`   - ${item.key}: ${item.value?.substring(0, 80)}...`);
      });
    } else {
      console.log(`✅ "${keyword}" - aucune occurrence`);
    }
  }
}

async function auditUsers() {
  console.log('\n\n📋 AUDIT: utilisateurs');
  console.log('═'.repeat(60));

  const { data, error } = await supabase
    .from('users')
    .select('id, email, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ Erreur:', error.message);
    return;
  }

  console.log(`\n👥 ${data.length} utilisateurs récents:`);
  data.forEach(user => {
    console.log(`   - ${user.email} (${new Date(user.created_at).toLocaleDateString('fr-FR')})`);
  });
}

async function main() {
  console.log('🚀 Audit Supabase - Happy Humans');
  console.log('═'.repeat(60));

  try {
    await auditSiteContent();
    await auditSiteSettings();
    await auditUsers();

    console.log('\n\n✅ Audit terminé');
    console.log('\n💡 Pour corriger les entrées problématiques:');
    console.log('   1. Exporter les IDs des entrées à modifier');
    console.log('   2. UPDATE site_content SET value = REPLACE(value, \'heldonica\', \'happy-humans\') WHERE ...');
    console.log('   3. Ou supprimer les entrées obsolètes via le dashboard Supabase');
  } catch (error) {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  }
}

main();
