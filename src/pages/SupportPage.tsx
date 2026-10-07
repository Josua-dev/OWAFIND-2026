import { useEffect, useState } from 'react';
import { Search, Plus, MessageSquare, ChevronDown, ChevronUp, LifeBuoy, Ticket } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/Feedback';
import { supportService } from '@/services';
import { useApp } from '@/context/AppContext';
import { formatDate, cn } from '@/utils/format';
import type { FAQ, SupportTicket } from '@/types';

export function SupportPage() {
  const { tickets, addTicket } = useApp();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newMessage, setNewMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    supportService.getFAQs().then((f) => { setFaqs(f); setLoading(false); });
  }, []);

  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(query.toLowerCase()) ||
    f.answer.toLowerCase().includes(query.toLowerCase()) ||
    f.category.toLowerCase().includes(query.toLowerCase())
  );

  const categories = [...new Set(faqs.map((f) => f.category))];

  const handleCreate = async () => {
    if (!newSubject.trim() || !newMessage.trim()) return;
    setSubmitting(true);
    const ticket = await supportService.createTicket(newSubject, newCategory, newMessage);
    addTicket(ticket);
    setSubmitting(false);
    setShowNew(false);
    setNewSubject('');
    setNewMessage('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  const ticketStatusVariant: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
    open: 'info', in_progress: 'warning', resolved: 'success', closed: 'default',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Help & Support</h1>
          <p className="text-slate-500 mt-1">Search FAQs, find answers, or create a support request</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      {success && (
        <div className="bg-success-50 border border-success-200 text-success-700 rounded-lg px-4 py-3 text-sm">
          Support request created! We'll get back to you soon.
        </div>
      )}

      {/* FAQ Search */}
      <Card>
        <CardBody className="space-y-4">
          <Input
            placeholder="Search help topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="animate-shimmer h-12 rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFaqs.length === 0 ? (
                <EmptyState icon={<LifeBuoy className="w-10 h-10" />} title="No results" description="Try a different search term or create a support request." />
              ) : (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{faq.question}</p>
                          <Badge variant="default" className="mt-1">{faq.category}</Badge>
                        </div>
                      </div>
                      {expandedFaq === faq.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed">{faq.answer}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Support Tickets */}
      <Card>
        <CardHeader title="My Support Requests" subtitle="Track your support tickets" />
        <CardBody>
          {tickets.length === 0 ? (
            <EmptyState icon={<Ticket className="w-10 h-10" />} title="No support requests" description="Create a new request if you need help." />
          ) : (
            <div className="space-y-3">
              {tickets.map((t: SupportTicket) => (
                <div key={t.id} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-800">{t.id}</p>
                      <Badge variant={ticketStatusVariant[t.status]} dot>{t.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">{t.subject}</p>
                    <p className="text-xs text-slate-400 mt-1">{t.category} • Created {formatDate(t.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="New Support Request" size="md">
        <div className="space-y-4">
          <Input label="Subject" required value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="Briefly describe your issue" />
          <Select label="Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="Technical">Technical</option>
            <option value="Account">Account</option>
          </Select>
          <Textarea label="Message" required value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Describe your issue in detail..." className="min-h-[120px]" />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button className="flex-1" onClick={handleCreate} disabled={submitting || !newSubject.trim() || !newMessage.trim()}>
              {submitting ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
