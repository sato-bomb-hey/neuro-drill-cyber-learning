import { CyberPanel } from '../ui/CyberPanel'
import type { ScoreRecord } from '../../types/game'

interface RankingBoardProps {
  scoreHistory: ScoreRecord[]
}

const SUBJECT_LABELS: Record<string, string> = {
  math: '数学',
  english: '英語',
  japanese: '国語',
  science: '理科',
  social: '社会',
}

export function RankingBoard({ scoreHistory }: RankingBoardProps) {
  const recent = [...scoreHistory]
    .sort((a, b) => b.date - a.date)
    .slice(0, 10)

  return (
    <CyberPanel title="SCORE.HISTORY" variant="blue">
      {recent.length === 0 ? (
        <div className="text-cyber-blue/40 font-mono text-sm text-center py-4">
          NO DATA — START DRILLING TO BUILD YOUR RECORD
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="text-cyber-blue/60 border-b border-cyber-blue/20">
                <th className="text-left py-2 pr-4">#</th>
                <th className="text-left py-2 pr-4">SUBJECT</th>
                <th className="text-left py-2 pr-4">SCORE</th>
                <th className="text-left py-2 pr-4">ACC%</th>
                <th className="text-left py-2">DATE</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((record, i) => {
                const accuracy = Math.round((record.score / record.total) * 100)
                const date = new Date(record.date).toLocaleString('ja-JP', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).replace(/\//g, '/')
                return (
                  <tr key={record.id} className="border-b border-cyber-blue/10 hover:bg-cyber-blue/5">
                    <td className="py-2 pr-4 text-cyber-blue/40">{i + 1}</td>
                    <td className="py-2 pr-4 text-cyber-blue">{SUBJECT_LABELS[record.subject]}</td>
                    <td className="py-2 pr-4 text-cyber-green font-bold">{record.score}</td>
                    <td className={`py-2 pr-4 font-bold ${accuracy >= 80 ? 'text-cyber-green' : accuracy >= 60 ? 'text-cyber-yellow' : 'text-cyber-red'}`}>
                      {accuracy}%
                    </td>
                    <td className="py-2 text-cyber-blue/40">{date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </CyberPanel>
  )
}
