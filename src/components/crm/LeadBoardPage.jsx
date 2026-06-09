import { useState } from "react";
import KanbanColumn from "./KanbanColumn.jsx";
import LeadDetailDrawer from "./LeadDetailDrawer.jsx";
import { LEADS, STAGES } from "./data.js";

export default function LeadBoardPage() {
  const [leads, setLeads] = useState(LEADS);
  const [draggingId, setDraggingId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [openLead, setOpenLead] = useState(null);

  const handleDragStart = (id) => setDraggingId(id);
  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTarget(null);
  };
  const handleDropOn = (stageId) => {
    if (!draggingId) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === draggingId ? { ...l, stage: stageId } : l)),
    );
    setDraggingId(null);
    setDropTarget(null);
  };

  return (
    <div className="-mx-6 flex flex-1 gap-3 overflow-x-auto px-6">
      {STAGES.map((stage) => (
        <KanbanColumn
          key={stage.id}
          stage={stage}
          leads={leads.filter((l) => l.stage === stage.id)}
          draggingId={draggingId}
          isDropTarget={dropTarget === stage.id}
          onLeadDragStart={handleDragStart}
          onLeadDragEnd={handleDragEnd}
          onDragOverColumn={() => setDropTarget(stage.id)}
          onDragLeaveColumn={() => setDropTarget((c) => (c === stage.id ? null : c))}
          onDropOnColumn={() => handleDropOn(stage.id)}
          onOpenLead={(lead) => setOpenLead(lead)}
        />
      ))}

      {openLead && <LeadDetailDrawer lead={openLead} onClose={() => setOpenLead(null)} />}
    </div>
  );
}
