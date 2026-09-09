import { Edit, Trash2, Star, Inbox } from 'lucide-react'
import { cls, NAVY, GOLD } from './admin-ui'

const fonts = { fontFamily: "'Inter'" }

export function DataTable({
  columns, data, onEdit, onDelete,
  primaryKey = 'id',
  renderActions, emptyHint,
}) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-3"><Inbox size={44} style={{ color: '#c9bda4' }} /></div>
        <p className="text-sm font-semibold" style={{ color: '#a59880', fontFamily: 'Cinzel' }}>{emptyHint || 'No records found'}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-left border-collapse" style={{ fontFamily: fonts.fontFamily }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="py-2.5 px-3 text-[10px] uppercase tracking-wider font-bold whitespace-nowrap"
                style={{ color: 'rgba(0,26,77,0.55)', borderBottom: '2px solid rgba(197,155,39,0.4)' }}>
                {c.label}
              </th>
            ))}
            <th className="py-2.5 px-3 text-right text-[10px] uppercase tracking-wider font-bold whitespace-nowrap"
              style={{ color: 'rgba(0,26,77,0.55)', borderBottom: '2px solid rgba(197,155,39,0.4)' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row[primaryKey] ?? i} className="hover:bg-black/[0.02] transition-colors">
              {columns.map((c) => (
                <td key={c.key} className="py-3 px-3 text-[12.5px] align-top" style={{ color: NAVY, borderBottom: '1px solid rgba(180,160,130,0.15)' }}>
                  <div className={cls(c.noWrap && 'whitespace-nowrap')}>
                    {c.render ? c.render(row, i) : row[c.key]}
                  </div>
                </td>
              ))}
              <td className="py-3 px-3 text-right whitespace-nowrap" style={{ borderBottom: '1px solid rgba(180,160,130,0.15)' }}>
                <div className="inline-flex items-center gap-1.5">
                  {row.featured !== undefined && (
                    <button title={row.featured ? 'Featured' : 'Mark featured'} onClick={() => onEdit && renderActions?.()}
                      style={{ border: 'none', background: 'none' }}>
                      <Star size={15} style={{ color: row.featured ? GOLD : '#c9bda4', fill: row.featured ? GOLD : 'none' }} />
                    </button>
                  )}
                  {onEdit && (
                    <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg hover:bg-black/5" title="Edit" style={{ border: 'none', background: 'none' }}>
                      <Edit size={15} color="#001a4d" />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(row)} className="p-1.5 rounded-lg hover:bg-red-500/10" title="Delete" style={{ border: 'none', background: 'none' }}>
                      <Trash2 size={15} color="#8b2518" />
                    </button>
                  )}
                  {renderActions && renderActions(row)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}