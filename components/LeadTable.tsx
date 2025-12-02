import React, { useState, useMemo } from 'react';
import { Lead } from '../types';
import { MessageCircle, Instagram, Star, Search, User, Pencil, Check, X, Phone } from 'lucide-react';
import { generateInstagramLink, generateWhatsAppLink, formatPhoneNumberDisplay, cleanPhoneNumber } from '../utils/formatters';

interface LeadTableProps {
  leads: Lead[];
  messageTemplate: string;
  onStatusChange: (id: string, newStatus: Lead['status']) => void;
  onPhoneUpdate: (id: string, newPhone: string | null) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, messageTemplate, onStatusChange, onPhoneUpdate }) => {
  const [search, setSearch] = useState('');
  
  // State for editing phone number
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Filter logic simplifies to just search
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [leads, search]);

  const handleWhatsAppClick = (lead: Lead) => {
    if (!lead.phone) return;
    const link = generateWhatsAppLink(lead.phone, messageTemplate, lead.name);
    window.open(link, '_blank');
    onStatusChange(lead.id, 'contacted');
  };

  const handleInstagramClick = (lead: Lead) => {
    if (!lead.username) return;
    const link = generateInstagramLink(lead.username);
    window.open(link, '_blank');
  };

  const toggleProspect = (lead: Lead) => {
    const newStatus = lead.status === 'prospect' ? 'pending' : 'prospect';
    onStatusChange(lead.id, newStatus);
  };

  const startEditing = (lead: Lead) => {
    setEditingId(lead.id);
    setEditValue(lead.phone || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const savePhone = (id: string) => {
    const cleaned = cleanPhoneNumber(editValue);
    onPhoneUpdate(id, cleaned);
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') savePhone(id);
    if (e.key === 'Escape') cancelEditing();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Simple Search Bar */}
      <div className="p-5 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-black/40 px-3 py-2.5 rounded-xl border border-white/5 w-full focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/20 transition-all">
          <Search className="w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Buscar academia..." 
            className="bg-transparent text-sm outline-none w-full text-zinc-200 placeholder:text-zinc-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-zinc-950/50 sticky top-0 z-10 backdrop-blur-md border-b border-white/5 shadow-sm">
            <tr>
              <th className="w-[45%] px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Nome da Academia
              </th>
              <th className="w-[25%] px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Contato
              </th>
              <th className="w-[30%] px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">
                  Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                {/* Name Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 transition-all shadow-lg ${lead.status === 'prospect' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'bg-zinc-800 text-zinc-400 border border-white/5'}`}>
                      {lead.status === 'prospect' ? <Star className="w-4 h-4 fill-current" /> : <User className="w-4 h-4"/>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-zinc-100 truncate text-base" title={lead.name}>
                        {lead.name || 'Sem nome'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact Column (Editable) */}
                <td className="px-6 py-4">
                  {editingId === lead.id ? (
                    <div className="flex items-center gap-1">
                      <input 
                        autoFocus
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, lead.id)}
                        placeholder="551199..."
                        className="bg-black/50 border border-violet-500/50 text-white text-sm rounded px-2 py-1 w-32 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      />
                      <button onClick={() => savePhone(lead.id)} className="p-1 hover:bg-emerald-500/20 text-emerald-500 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={cancelEditing} className="p-1 hover:bg-red-500/20 text-red-500 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group/edit">
                      <div className={`text-sm font-mono ${lead.phone ? 'text-zinc-300' : 'text-zinc-600 italic'}`}>
                        {formatPhoneNumberDisplay(lead.phone)}
                      </div>
                      <button 
                        onClick={() => startEditing(lead)}
                        className="opacity-0 group-hover/edit:opacity-100 p-1 hover:bg-white/10 rounded text-zinc-500 hover:text-white transition-all"
                        title="Editar número"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </td>

                {/* Actions Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    {/* WhatsApp Button */}
                    <button
                      onClick={() => handleWhatsAppClick(lead)}
                      disabled={!lead.phone}
                      className={`flex items-center justify-center p-2.5 rounded-lg transition-all transform active:scale-95 shrink-0 ${
                        lead.phone 
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-900/30' 
                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5 opacity-50'
                      }`}
                      title={lead.phone ? "Enviar mensagem no WhatsApp" : "Adicione um número para habilitar"}
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>

                    {/* Instagram Button */}
                    <button
                      onClick={() => handleInstagramClick(lead)}
                      disabled={!lead.username}
                      className={`flex items-center justify-center p-2.5 rounded-lg transition-all active:scale-95 shrink-0 ${
                        lead.username
                        ? 'bg-gradient-to-tr from-orange-600/20 to-pink-600/20 border border-white/10 text-pink-400 hover:text-white hover:border-pink-500/50 hover:from-orange-500 hover:to-pink-600'
                        : 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5 opacity-50'
                      }`}
                      title={lead.username ? "Abrir Instagram" : "Link não identificado"}
                    >
                      <Instagram className="w-5 h-5" />
                    </button>

                    {/* Prospect Toggle (Optional visual marker) */}
                    <button
                      onClick={() => toggleProspect(lead)}
                      className={`flex items-center justify-center p-2.5 rounded-lg transition-all active:scale-95 border shrink-0 ${
                        lead.status === 'prospect'
                        ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500/30'
                        : 'bg-transparent border-zinc-700 text-zinc-500 hover:border-amber-500/50 hover:text-amber-400 hover:bg-amber-500/10'
                      }`}
                      title="Marcar como Prospect"
                    >
                      <Star className={`w-5 h-5 ${lead.status === 'prospect' ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredLeads.length === 0 && (
                <tr>
                    <td colSpan={3} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-zinc-500">
                          <Search className="w-8 h-8 mb-3 opacity-20" />
                          <p>Nenhuma academia encontrada.</p>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};