import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatFileSize } from '@/utils/format';
import type { UploadedDocument, DocumentType } from '@/types';
import { documentService } from '@/services';
import { useApp } from '@/context/AppContext';

const documentTypes: DocumentType[] = [
  'ID Document',
  'Proof of Employment',
  'Marriage Certificate',
  'Death Certificate',
  'Beneficiary Documentation',
  'Other Supporting Evidence',
];

export function DocumentUploader({ claimId }: { claimId?: string }) {
  const { documents, addDocument, updateDocument, removeDocument } = useApp();
  const [dragOver, setDragOver] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('ID Document');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const claimDocs = claimId
    ? documents.filter((d) => d.claimId === claimId)
    : documents;

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const doc = await documentService.uploadDocument(file, selectedType);
      doc.claimId = claimId;
      addDocument(doc);

      const verified = await documentService.verifyDocument(doc);
      updateDocument(verified);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Document Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as DocumentType)}
          className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {documentTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all',
          dragOver ? 'border-primary-400 bg-primary-50' : 'border-slate-300 hover:border-slate-400'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <UploadCloud className={cn('mx-auto mb-2', dragOver ? 'text-primary-500' : 'text-slate-400')} size={32} />
        <p className="text-sm text-slate-600 font-medium">Drop files here or click to upload</p>
        <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
        {uploading && (
          <div className="flex items-center justify-center gap-2 mt-3 text-primary-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {claimDocs.map((doc) => (
            <DocumentRow key={doc.id} doc={doc} onRemove={() => removeDocument(doc.id)} />
          ))}
        </AnimatePresence>
      </div>

      {claimDocs.length === 0 && !uploading && (
        <p className="text-center text-sm text-slate-400 py-2">No documents uploaded yet</p>
      )}
    </div>
  );
}

function DocumentRow({ doc, onRemove }: { doc: UploadedDocument; onRemove: () => void }) {
  const statusIcon = {
    verified: <CheckCircle2 className="w-4 h-4 text-success-500" />,
    needs_review: <AlertCircle className="w-4 h-4 text-warning-500" />,
    scanning: <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />,
    uploading: <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />,
    error: <AlertCircle className="w-4 h-4 text-error-500" />,
  };

  const statusLabel = {
    verified: 'Verified',
    needs_review: 'Needs review',
    scanning: 'Scanning...',
    uploading: 'Uploading...',
    error: 'Error',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
    >
      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 truncate">{doc.name}</p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{doc.type}</span>
          <span>•</span>
          <span>{formatFileSize(doc.size)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex items-center gap-1 text-xs font-medium text-slate-600">
          {statusIcon[doc.uploadStatus]}
          {statusLabel[doc.uploadStatus]}
        </span>
        <button onClick={onRemove} className="text-slate-300 hover:text-error-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
