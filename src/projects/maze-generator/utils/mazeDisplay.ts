import { Cell } from "../types";

export const getCellStyle = (cell: Cell, options?: { borderWidth?: string; borderColor?: string }): React.CSSProperties => {
	const { borderWidth = "1px", borderColor = "#374151" } = options || {};
	
	const style: React.CSSProperties = {
		position: "relative",
		backgroundColor: cell.visited ? "#f3f4f6" : "#1f2937",
		transition: "background-color 0.2s ease",
	};

	if (cell.walls.top) {
		style.borderTop = `${borderWidth} solid ${borderColor}`;
	}
	if (cell.walls.right) {
		style.borderRight = `${borderWidth} solid ${borderColor}`;
	}
	if (cell.walls.bottom) {
		style.borderBottom = `${borderWidth} solid ${borderColor}`;
	}
	if (cell.walls.left) {
		style.borderLeft = `${borderWidth} solid ${borderColor}`;
	}

	// Priority order: Start > End > Solution > User Path > Explored > Background
	if (cell.isStart) {
		style.backgroundColor = "#10b981";
	} else if (cell.isEnd) {
		style.backgroundColor = "#ef4444";
	} else if (cell.isSolution) {
		style.backgroundColor = "#f59e0b";
	} else if (cell.isPath) {
		style.backgroundColor = "#3b82f6";
	} else if (cell.isExplored) {
		style.backgroundColor = "#a855f7";
	}

	return style;
};