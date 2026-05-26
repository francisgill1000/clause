<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Comment;
use App\Models\Contract;
use App\Models\ContractParty;
use App\Models\Counterparty;
use App\Models\Milestone;
use App\Models\Template;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Admin User (reads from env in production) ──────────────────
        $user = User::factory()->create([
            'name' => 'Imani Okafor',
            'email' => env('Admin_EMAIL', 'imani@halcyon.io'),
            'password' => bcrypt(env('Admin_PASSWORD', 'password')),
        ]);

        $uid = $user->id;

        // ── Counterparties ─────────────────────────────────────────────
        $counterparties = collect([
            ['name' => 'Northwind Logistics',    'initials' => 'NL', 'domain' => 'northwindlogistics.com', 'color' => '#3b82f6'],
            ['name' => 'Helix Biotech',          'initials' => 'HB', 'domain' => 'helix.bio',             'color' => '#10b981'],
            ['name' => 'Atlas Property Group',   'initials' => 'AP', 'domain' => 'atlasprop.co',          'color' => '#f59e0b'],
            ['name' => 'Lumen Studios',          'initials' => 'LS', 'domain' => 'lumenstudios.io',       'color' => '#a855f7'],
            ['name' => 'Bramble & Finch LLP',    'initials' => 'BF', 'domain' => 'bramblefinch.law',      'color' => '#ec4899'],
            ['name' => 'Cobalt Manufacturing',   'initials' => 'CM', 'domain' => 'cobaltmfg.com',         'color' => '#0ea5e9'],
            ['name' => 'Meridian Capital',       'initials' => 'MC', 'domain' => 'meridian.fund',         'color' => '#14b8a6'],
            ['name' => 'Quill Press',            'initials' => 'QP', 'domain' => 'quillpress.co',         'color' => '#ef4444'],
        ])->map(fn ($cp) => Counterparty::create(array_merge($cp, ['user_id' => $uid])));

        // Helper to look up counterparty by initials
        $cp = fn (string $initials) => $counterparties->firstWhere('initials', $initials);

        // ── Contracts ──────────────────────────────────────────────────
        $contractsData = [
            [
                'contract_number' => 'CL-2026-0184',
                'title' => 'MSA — Northwind Logistics',
                'type' => 'MSA',
                'counterparty' => 'NL',
                'status' => 'review',
                'value' => 1240000,
                'start_date' => '2026-06-01',
                'end_date' => '2028-05-31',
                'term' => '24 months',
                'auto_renew' => 'On (12 mo)',
                'notice_period' => '90 days',
                'risk_score' => 72,
                'progress' => 60,
            ],
            [
                'contract_number' => 'CL-2026-0179',
                'title' => 'SOW #4 — Helix Biotech',
                'type' => 'SOW',
                'counterparty' => 'HB',
                'status' => 'signature',
                'value' => 285000,
                'start_date' => '2026-06-15',
                'end_date' => '2026-12-15',
                'term' => '6 months',
                'auto_renew' => 'Off',
                'notice_period' => '30 days',
                'risk_score' => 88,
                'progress' => 80,
            ],
            [
                'contract_number' => 'CL-2026-0172',
                'title' => 'Office Lease — Atlas Property Group (Floor 14)',
                'type' => 'Lease',
                'counterparty' => 'AP',
                'status' => 'active',
                'value' => 4320000,
                'start_date' => '2025-09-01',
                'end_date' => '2028-08-31',
                'term' => '36 months',
                'auto_renew' => 'Off',
                'notice_period' => '180 days',
                'risk_score' => 64,
                'progress' => 100,
            ],
            [
                'contract_number' => 'CL-2026-0168',
                'title' => 'Production Licence — Lumen Studios',
                'type' => 'IP Licence',
                'counterparty' => 'LS',
                'status' => 'drafting',
                'value' => 95000,
                'start_date' => '2026-07-01',
                'end_date' => '2027-06-30',
                'term' => '12 months',
                'auto_renew' => 'On (12 mo)',
                'notice_period' => '60 days',
                'risk_score' => 54,
                'progress' => 30,
            ],
            [
                'contract_number' => 'CL-2026-0151',
                'title' => 'NDA — Bramble & Finch LLP',
                'type' => 'NDA',
                'counterparty' => 'BF',
                'status' => 'active',
                'value' => 0,
                'start_date' => '2026-03-01',
                'end_date' => '2028-03-01',
                'term' => '24 months',
                'auto_renew' => 'Off',
                'notice_period' => null,
                'risk_score' => 92,
                'progress' => 100,
            ],
            [
                'contract_number' => 'CL-2026-0142',
                'title' => 'Supply Agreement — Cobalt Manufacturing',
                'type' => 'Supply',
                'counterparty' => 'CM',
                'status' => 'expiring',
                'value' => 780000,
                'start_date' => '2024-06-01',
                'end_date' => '2026-06-30',
                'term' => '24 months',
                'auto_renew' => 'Off',
                'notice_period' => '60 days',
                'risk_score' => 41,
                'progress' => 100,
            ],
            [
                'contract_number' => 'CL-2026-0138',
                'title' => 'Investor Side Letter — Meridian Capital',
                'type' => 'Side Letter',
                'counterparty' => 'MC',
                'status' => 'review',
                'value' => 0,
                'start_date' => '2026-06-30',
                'end_date' => 'Perpetual',
                'term' => 'Perpetual',
                'auto_renew' => null,
                'notice_period' => null,
                'risk_score' => 58,
                'progress' => 50,
            ],
            [
                'contract_number' => 'CL-2026-0129',
                'title' => 'Print Services Agreement — Quill Press',
                'type' => 'Services',
                'counterparty' => 'QP',
                'status' => 'drafting',
                'value' => 42500,
                'start_date' => '2026-07-15',
                'end_date' => '2027-07-14',
                'term' => '12 months',
                'auto_renew' => 'On (12 mo)',
                'notice_period' => '30 days',
                'risk_score' => 76,
                'progress' => 20,
            ],
        ];

        $contracts = collect($contractsData)->map(function ($data) use ($uid, $cp) {
            $counterparty = $cp($data['counterparty']);
            unset($data['counterparty']);

            return Contract::create(array_merge($data, [
                'user_id' => $uid,
                'owner_id' => $uid,
                'counterparty_id' => $counterparty->id,
            ]));
        });

        // ── Templates ──────────────────────────────────────────────────
        $templates = [
            ['name' => 'Mutual NDA',             'description' => 'Standard mutual non-disclosure agreement for two-party confidentiality.',        'uses_count' => 142, 'department' => 'Legal',   'ribbon' => 'Popular'],
            ['name' => 'Master Services Agreement', 'description' => 'MSA v3.2 — umbrella agreement for ongoing service engagements.',             'uses_count' => 38,  'department' => 'Legal',   'ribbon' => 'Updated'],
            ['name' => 'Statement of Work',      'description' => 'Hooks into MSA. Defines deliverables, timeline and fees for a specific project.', 'uses_count' => 71,  'department' => 'Ops',     'ribbon' => null],
            ['name' => 'Order Form',             'description' => 'Short-form ordering document referencing master terms.',                          'uses_count' => 24,  'department' => 'Sales',   'ribbon' => null],
            ['name' => 'Data Processing Addendum', 'description' => 'GDPR + UK GDPR compliant data processing addendum.',                          'uses_count' => 16,  'department' => 'Privacy', 'ribbon' => 'New'],
            ['name' => 'Reseller Agreement',     'description' => 'Non-exclusive reseller terms with territory and pricing schedules.',              'uses_count' => 7,   'department' => 'Sales',   'ribbon' => null],
            ['name' => 'Mutual Termination',     'description' => 'Clean wind-down agreement for mutual contract termination.',                     'uses_count' => 11,  'department' => 'Legal',   'ribbon' => null],
            ['name' => 'Consulting Agreement',   'description' => 'Individual consultant engagement agreement with IP assignment.',                  'uses_count' => 29,  'department' => 'People',  'ribbon' => null],
        ];

        foreach ($templates as $tpl) {
            Template::create(array_merge($tpl, ['user_id' => $uid]));
        }

        // ── Detail data for CL-2026-0184 (Northwind MSA) ──────────────
        $northwindContract = $contracts->first(); // CL-2026-0184

        // Contract Parties
        ContractParty::create([
            'contract_id' => $northwindContract->id,
            'kind' => 'internal',
            'company_name' => 'Halcyon Industries',
            'company_sub' => 'Legal Department',
            'signer_name' => 'Imani Okafor',
            'signer_title' => 'Head of Legal',
            'initials' => 'IO',
            'signed' => true,
            'signed_at' => '2026-05-20 14:30:00',
        ]);

        ContractParty::create([
            'contract_id' => $northwindContract->id,
            'kind' => 'counter',
            'company_name' => 'Northwind Logistics',
            'company_sub' => 'Procurement',
            'signer_name' => 'Erik Svensson',
            'signer_title' => 'VP Procurement',
            'initials' => 'ES',
            'signed' => false,
            'signed_at' => null,
        ]);

        // Milestones
        $milestones = [
            ['name' => 'Internal draft completed',     'target_date' => '2026-04-15', 'is_completed' => true,  'is_next' => false, 'sort_order' => 1],
            ['name' => 'Legal review',                  'target_date' => '2026-04-30', 'is_completed' => true,  'is_next' => false, 'sort_order' => 2],
            ['name' => 'Sent to counterparty',          'target_date' => '2026-05-05', 'is_completed' => true,  'is_next' => false, 'sort_order' => 3],
            ['name' => 'Counterparty redline received', 'target_date' => '2026-05-18', 'is_completed' => true,  'is_next' => false, 'sort_order' => 4],
            ['name' => 'Final review & approval',       'target_date' => '2026-05-28', 'is_completed' => false, 'is_next' => true,  'sort_order' => 5],
            ['name' => 'Signature',                     'target_date' => '2026-06-01', 'is_completed' => false, 'is_next' => false, 'sort_order' => 6],
            ['name' => 'Execution & filing',            'target_date' => '2026-06-03', 'is_completed' => false, 'is_next' => false, 'sort_order' => 7],
        ];

        foreach ($milestones as $ms) {
            Milestone::create(array_merge($ms, ['contract_id' => $northwindContract->id]));
        }

        // Activities
        $activities = [
            ['actor' => 'Imani Okafor',   'description' => 'Uploaded redline v3 from Northwind',        'when_text' => '2 hours ago',  'is_highlighted' => true],
            ['actor' => 'System',          'description' => 'Risk score updated: 68 -> 72',              'when_text' => '5 hours ago',  'is_highlighted' => false],
            ['actor' => 'Erik Svensson',   'description' => 'Added comment on clause 14.2 (Limitation)', 'when_text' => 'Yesterday',    'is_highlighted' => false],
            ['actor' => 'Imani Okafor',   'description' => 'Moved status from Drafting to Review',       'when_text' => '3 days ago',   'is_highlighted' => false],
            ['actor' => 'System',          'description' => 'Contract created',                           'when_text' => '2 weeks ago',  'is_highlighted' => false],
        ];

        foreach ($activities as $act) {
            Activity::create(array_merge($act, ['contract_id' => $northwindContract->id]));
        }

        // Comments
        Comment::create([
            'contract_id' => $northwindContract->id,
            'user_id' => $uid,
            'author_name' => 'Imani Okafor',
            'company' => 'Halcyon Industries',
            'initials' => 'IO',
            'body' => 'Clause 14.2 caps liability at 1x annual fees — we typically ask for 2x. Flagging for discussion.',
            'is_suggestion' => false,
        ]);

        Comment::create([
            'contract_id' => $northwindContract->id,
            'user_id' => $uid,
            'author_name' => 'Erik Svensson',
            'company' => 'Northwind Logistics',
            'initials' => 'ES',
            'body' => 'We can move to 1.5x if you accept the carve-out for wilful misconduct in 14.3.',
            'is_suggestion' => true,
        ]);

        Comment::create([
            'contract_id' => $northwindContract->id,
            'user_id' => $uid,
            'author_name' => 'Imani Okafor',
            'company' => 'Halcyon Industries',
            'initials' => 'IO',
            'body' => 'Acceptable — drafting the amendment now. Will send v4 by EOD.',
            'is_suggestion' => false,
        ]);
    }
}
