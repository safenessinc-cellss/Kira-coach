import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useActivityLogger } from '../hooks/useActivityLogger';
import { SEED_TRANSACTIONS } from '../lib/seedData';
import { Transaction } from '../types';
import { CreditCard, Download, RotateCcw, CheckCircle2, Clock, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';

export function AdminPayments() {
  const { user } = useAuth();
  const { logAction } = useActivityLogger();
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<'totales' | 'transacciones' | 'payouts' | 'pasarelas'>('totales');

  // Metrics calculation (70/30 platform vs coach split)
  const totalGross = transactions.filter(t => t.status === 'succeeded').reduce((acc, t) => acc + t.amount, 0);
  const totalKiraNet = transactions.filter(t => t.status === 'succeeded').reduce((acc, t) => acc + t.platformCut, 0);
  const totalCoachPayouts = transactions.filter(t => t.status === 'succeeded').reduce((acc, t) => acc + t.coachCut, 0);
  const totalRefunds = transactions.filter(t => t.status === 'refunded').reduce((acc, t) => acc + t.amount, 0);

  const handleRefund = async (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    if (confirm(`¿Proceder al reembolso de $${tx.amount} ${tx.currency} a través de ${tx.provider.toUpperCase()}? Esta acción revocará en cascada las inscripciones y certificados asociados.`)) {
      setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'refunded', refundReason: 'Solicitado por administración' } : t));
      await logAction('refund_processed', {
        transactionId: tx.id,
        amount: tx.amount,
        provider: tx.provider,
        currency: tx.currency
      });
      alert(`Reembolso emitido con éxito hacia la pasarela ${tx.provider.toUpperCase()}.`);
    }
  };

  const handleMarkPayout = async (txId: string) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, payoutStatus: 'liquidated' } : t));
    await logAction('payout_marked', { transactionId: txId });
    alert('Liquidación marcada como pagada al coach.');
  };

  const exportCSV = () => {
    const headers = 'ID,Usuario,Tipo,Monto,Moneda,Pasarela,Estado,KiraNet,CoachCut,Fecha\n';
    const rows = transactions.map(t =>
      `${t.id},${t.userEmail},${t.type},${t.amount},${t.currency},${t.provider},${t.status},${t.platformCut},${t.coachCut},${t.createdAt}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kira_transacciones_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-[#7C5CFF] uppercase">
            Control de Facturación & Pasarelas
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Gestión Financiera & Liquidaciones
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mt-1">
            Monitoreo en tiempo real del split de ingresos (70% plataforma / 30% coach), reembolsos y estado de Stripe y Mercado Pago.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-all self-start"
        >
          <Download size={15} /> Exportar CSV
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
            Volumen Bruto Facturado
          </span>
          <span className="text-3xl font-black font-mono text-white">
            ${totalGross.toFixed(2)}
          </span>
          <span className="text-xs text-slate-400 block mt-1">100% transacciones exitosas</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-emerald-500/30 bg-emerald-500/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
            KIRA Net Revenue (70%)
          </span>
          <span className="text-3xl font-black font-mono text-emerald-300">
            ${totalKiraNet.toFixed(2)}
          </span>
          <span className="text-xs text-emerald-400/80 block mt-1">Margen operativo plataforma</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-[#7C5CFF]/30 bg-[#7C5CFF]/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#22D3EE] block mb-1">
            Coach Payouts (30%)
          </span>
          <span className="text-3xl font-black font-mono text-white">
            ${totalCoachPayouts.toFixed(2)}
          </span>
          <span className="text-xs text-slate-400 block mt-1">Liquidaciones devengadas a mentores</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-rose-500/30 bg-rose-500/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 block mb-1">
            Reembolsos (Refunds)
          </span>
          <span className="text-3xl font-black font-mono text-rose-300">
            ${totalRefunds.toFixed(2)}
          </span>
          <span className="text-xs text-rose-400/80 block mt-1">Cero fricción de contracargos</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        {[
          { id: 'totales', label: 'Resumen Financiero' },
          { id: 'transacciones', label: 'Transacciones' },
          { id: 'payouts', label: 'Liquidaciones de Coaches (Payouts)' },
          { id: 'pasarelas', label: 'Estado Pasarelas (Stripe & Mercado Pago)' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id
                ? 'bg-white/10 text-[#22D3EE] border border-white/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      {(activeTab === 'totales' || activeTab === 'transacciones') && (
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="p-4 pl-6">ID & Pasarela</th>
                <th className="p-4">Usuario</th>
                <th className="p-4">Concepto</th>
                <th className="p-4">Monto</th>
                <th className="p-4">Split (70 / 30)</th>
                <th className="p-4">Estado</th>
                <th className="p-4 pr-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-white/2 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-mono font-bold text-white">{t.id}</p>
                    <span className="text-[10px] uppercase font-bold text-[#22D3EE]">{t.provider}</span>
                  </td>
                  <td className="p-4 text-slate-300 font-mono text-[11px]">{t.userEmail}</td>
                  <td className="p-4 text-slate-200">{t.courseTitle || 'Membresía Coach'}</td>
                  <td className="p-4 font-mono font-bold text-white">${t.amount} {t.currency}</td>
                  <td className="p-4 text-[11px] font-mono text-slate-400">
                    <span className="text-emerald-400">${t.platformCut}</span> / <span className="text-slate-200">${t.coachCut}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      t.status === 'succeeded' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {t.status === 'succeeded' && (
                      <button
                        onClick={() => handleRefund(t.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs transition-colors"
                      >
                        Reembolsar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payouts Tab */}
      {activeTab === 'payouts' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-white">Liquidaciones Pendientes a Mentores</h3>
          <p className="text-xs text-slate-400">
            Cálculo server-side automático del 30% correspondiente a las ventas brutas netas de reembolsos.
          </p>

          <div className="space-y-3">
            {transactions.filter(t => t.coachCut > 0).map(t => (
              <div key={t.id} className="p-4 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{t.courseTitle}</h4>
                  <p className="text-xs text-slate-400">Coach asignado: {t.coachId} · Transacción: {t.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base font-black font-mono text-emerald-400">
                    ${t.coachCut} {t.currency}
                  </span>
                  {t.payoutStatus === 'liquidated' ? (
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                      Liquidado
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMarkPayout(t.id)}
                      className="px-4 py-2 rounded-xl bg-[#7C5CFF] hover:bg-[#7C5CFF]/90 text-white text-xs font-bold uppercase"
                    >
                      Marcar Pagado
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gateway status tab */}
      {activeTab === 'pasarelas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Stripe Checkout</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                Operativo
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Soporte de pagos con tarjeta de crédito/débito internacional en USD y EUR con webhook idempotente.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Mercado Pago</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                Operativo
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Procesamiento de pagos locales para Latinoamérica (México, Colombia, Argentina, Chile).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
