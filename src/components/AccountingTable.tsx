import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Entry {
  id: number;
  date: string;
  description: string;
  debit: number;
  credit: number;
}

export default function AccountingTable() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<Entry>({
    id: Date.now(),
    date: '',
    description: '',
    debit: 0,
    credit: 0
  });

  const addEntry = () => {
    if (newEntry.date && newEntry.description) {
      setEntries([...entries, { ...newEntry, id: Date.now() }]);
      setNewEntry({
        id: Date.now(),
        date: '',
        description: '',
        debit: 0,
        credit: 0
      });
    }
  };

  const removeEntry = (id: number) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const calculateTotals = () => {
    return entries.reduce(
      (acc, curr) => ({
        totalDebit: acc.totalDebit + curr.debit,
        totalCredit: acc.totalCredit + curr.credit
      }),
      { totalDebit: 0, totalCredit: 0 }
    );
  };

  const { totalDebit, totalCredit } = calculateTotals();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Libro Contable</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Haber</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.debit.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.credit.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="px-6 py-4">
                <input
                  type="date"
                  className="form-input rounded-md shadow-sm mt-1 block w-full"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  className="form-input rounded-md shadow-sm mt-1 block w-full"
                  placeholder="Descripción"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  className="form-input rounded-md shadow-sm mt-1 block w-full"
                  placeholder="0.00"
                  value={newEntry.debit || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, debit: parseFloat(e.target.value) || 0 })}
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  className="form-input rounded-md shadow-sm mt-1 block w-full"
                  placeholder="0.00"
                  value={newEntry.credit || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, credit: parseFloat(e.target.value) || 0 })}
                />
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={addEntry}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={2}>Totales</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{totalDebit.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{totalCredit.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}