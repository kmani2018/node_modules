"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function appendPropertyInAstObject(recorder, node, propertyName, value, indent) {
    const indentStr = _buildIndent(indent);
    let index = node.start.offset + 1;
    if (node.properties.length > 0) {
        // Insert comma.
        const last = node.properties[node.properties.length - 1];
        const { text, end } = last;
        const commaIndex = text.endsWith('\n') ? end.offset - 1 : end.offset;
        recorder.insertRight(commaIndex, ',');
        index = end.offset;
    }
    const content = JSON.stringify(value, null, indent).replace(/\n/g, indentStr);
    recorder.insertRight(index, (node.properties.length === 0 && indent ? '\n' : '')
        + ' '.repeat(indent)
        + `"${propertyName}":${indent ? ' ' : ''}${content}`
        + indentStr.slice(0, -indent));
}
exports.appendPropertyInAstObject = appendPropertyInAstObject;
function insertPropertyInAstObjectInOrder(recorder, node, propertyName, value, indent) {
    if (node.properties.length === 0) {
        appendPropertyInAstObject(recorder, node, propertyName, value, indent);
        return;
    }
    // Find insertion info.
    let insertAfterProp = null;
    let prev = null;
    let isLastProp = false;
    const last = node.properties[node.properties.length - 1];
    for (const prop of node.properties) {
        if (prop.key.value > propertyName) {
            if (prev) {
                insertAfterProp = prev;
            }
            break;
        }
        if (prop === last) {
            isLastProp = true;
            insertAfterProp = last;
        }
        prev = prop;
    }
    if (isLastProp) {
        appendPropertyInAstObject(recorder, node, propertyName, value, indent);
        return;
    }
    const indentStr = _buildIndent(indent);
    const insertIndex = insertAfterProp === null
        ? node.start.offset + 1
        : insertAfterProp.end.offset + 1;
    const content = JSON.stringify(value, null, indent).replace(/\n/g, indentStr);
    recorder.insertRight(insertIndex, indentStr
        + `"${propertyName}":${indent ? ' ' : ''}${content}`
        + ',');
}
exports.insertPropertyInAstObjectInOrder = insertPropertyInAstObjectInOrder;
function appendValueInAstArray(recorder, node, value, indent = 4) {
    const indentStr = _buildIndent(indent);
    let index = node.start.offset + 1;
    if (node.elements.length > 0) {
        // Insert comma.
        const last = node.elements[node.elements.length - 1];
        recorder.insertRight(last.end.offset, ',');
        index = indent ? last.end.offset + 1 : last.end.offset;
    }
    recorder.insertRight(index, (node.elements.length === 0 && indent ? '\n' : '')
        + ' '.repeat(indent)
        + JSON.stringify(value, null, indent).replace(/\n/g, indentStr)
        + indentStr.slice(0, -indent));
}
exports.appendValueInAstArray = appendValueInAstArray;
function findPropertyInAstObject(node, propertyName) {
    let maybeNode = null;
    for (const property of node.properties) {
        if (property.key.value == propertyName) {
            maybeNode = property.value;
        }
    }
    return maybeNode;
}
exports.findPropertyInAstObject = findPropertyInAstObject;
function _buildIndent(count) {
    return count ? '\n' + ' '.repeat(count) : '';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvanNvbi11dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWdCQSxTQUFnQix5QkFBeUIsQ0FDdkMsUUFBd0IsRUFDeEIsSUFBbUIsRUFDbkIsWUFBb0IsRUFDcEIsS0FBZ0IsRUFDaEIsTUFBYztJQUVkLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDbEMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDOUIsZ0JBQWdCO1FBQ2hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUM7UUFDekIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDckUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7S0FDcEI7SUFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM5RSxRQUFRLENBQUMsV0FBVyxDQUNsQixLQUFLLEVBQ0wsQ0FBQyxJ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QUMsS0FBYTtJQUNqQyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMvQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgSnNvbkFzdEFycmF5LFxuICBKc29uQXN0S2V5VmFsdWUsXG4gIEpzb25Bc3ROb2RlLFxuICBKc29uQXN0T2JqZWN0LFxuICBKc29uVmFsdWUsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IFVwZGF0ZVJlY29yZGVyIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kUHJvcGVydHlJbkFzdE9iamVjdChcbiAgcmVjb3JkZXI6IFVwZGF0ZVJlY29yZGVyLFxuICBub2RlOiBKc29uQXN0T2JqZWN0LFxuICBwcm9wZXJ0eU5hbWU6IHN0cmluZyxcbiAgdmFsdWU6IEpzb25WYWx1ZSxcbiAgaW5kZW50OiBudW1iZXIsXG4pIHtcbiAgY29uc3QgaW5kZW50U3RyID0gX2J1aWxkSW5kZW50KGluZGVudCk7XG4gIGxldCBpbmRleCA9IG5vZGUuc3RhcnQub2Zmc2V0ICsgMTtcbiAgaWYgKG5vZGUucHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgLy8gSW5zZXJ0IGNvbW1hLlxuICAgIGNvbnN0IGxhc3QgPSBub2RlLnByb3BlcnRpZXNbbm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IHt0ZXh0LCBlbmR9ID0gbGFzdDtcbiAgICBjb25zdCBjb21tYUluZGV4ID0gdGV4dC5lbmRzV2l0aCgnXFxuJykgPyBlbmQub2Zmc2V0IC0gMSA6IGVuZC5vZmZzZXQ7XG4gICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoY29tbWFJbmRleCwgJywnKTtcbiAgICBpbmRleCA9IGVuZC5vZmZzZXQ7XG4gIH1cbiAgY29uc3QgY29udGVudCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlLCBudWxsLCBpbmRlbnQpLnJlcGxhY2UoL1xcbi9nLCBpbmRlbnRTdHIpO1xuICByZWNvcmRlci5pbnNlcnRSaWdodChcbiAgICBpbmRleCxcbiAgICAobm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCAmJiBpbmRlbnQgPyAnXFxuJyA6ICcnKVxuICAgICsgJyAnLnJlcGVhdChpbmRlbnQpXG4gICAgKyBgXCIke3Byb3BlcnR5TmFtZX1cIjoke2luZGVudCA/ICcgJyA6ICcnfSR7Y29udGVudH1gXG4gICAgKyBpbmRlbnRTdHIuc2xpY2UoMCwgLWluZGVudCksXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbnNlcnRQcm9wZXJ0eUluQXN0T2JqZWN0SW5PcmRlcihcbiAgcmVjb3JkZXI6IFVwZGF0ZVJlY29yZGVyLFxuICBub2RlOiBKc29uQXN0T2JqZWN0LFxuICBwcm9wZXJ0eU5hbWU6IHN0cmluZyxcbiAgdmFsdWU6IEpzb25WYWx1ZSxcbiAgaW5kZW50OiBudW1iZXIsXG4pIHtcblxuICBpZiAobm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgIGFwcGVuZFByb3BlcnR5SW5Bc3RPYmplY3QocmVjb3JkZXIsIG5vZGUsIHByb3BlcnR5TmFtZSwgdmFsdWUsIGluZGVudCk7XG5cbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBGaW5kIGluc2VydGlvbiBpbmZvLlxuICBsZXQgaW5zZXJ0QWZ0ZXJQcm9wOiBKc29uQXN0S2V5VmFsdWUgfCBudWxsID0gbnVsbDtcbiAgbGV0IHByZXY6IEpzb25Bc3RLZXlWYWx1ZSB8IG51bGwgPSBudWxsO1xuICBsZXQgaXNMYXN0UHJvcCA9IGZhbHNlO1xuICBjb25zdCBsYXN0ID0gbm9kZS5wcm9wZXJ0aWVzW25vZGUucHJvcGVydGllcy5sZW5ndGggLSAxXTtcbiAgZm9yIChjb25zdCBwcm9wIG9mIG5vZGUucHJvcGVydGllcykge1xuICAgIGlmIChwcm9wLmtleS52YWx1ZSA+IHByb3BlcnR5TmFtZSkge1xuICAgICAgaWYgKHByZXYpIHtcbiAgICAgICAgaW5zZXJ0QWZ0ZXJQcm9wID0gcHJldjtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAocHJvcCA9PT0gbGFzdCkge1xuICAgICAgaXNMYXN0UHJvcCA9IHRydWU7XG4gICAgICBpbnNlcnRBZnRlclByb3AgPSBsYXN0O1xuICAgIH1cbiAgICBwcmV2ID0gcHJvcDtcbiAgfVxuXG4gIGlmIChpc0xhc3RQcm9wKSB7XG4gICAgYXBwZW5kUHJvcGVydHlJbkFzdE9iamVjdChyZWNvcmRlciwgbm9kZSwgcHJvcGVydHlOYW1lLCB2YWx1ZSwgaW5kZW50KTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGluZGVudFN0ciA9IF9idWlsZEluZGVudChpbmRlbnQpO1xuICBjb25zdCBpbnNlcnRJbmRleCA9IGluc2VydEFmdGVyUHJvcCA9PT0gbnVsbFxuICAgID8gbm9kZS5zdGFydC5vZmZzZXQgKyAxXG4gICAgOiBpbnNlcnRBZnRlclByb3AuZW5kLm9mZnNldCArIDE7XG4gIGNvbnN0IGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSwgbnVsbCwgaW5kZW50KS5yZXBsYWNlKC9cXG4vZywgaW5kZW50U3RyKTtcbiAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoXG4gICAgaW5zZXJ0SW5kZXgsXG4gICAgaW5kZW50U3RyXG4gICAgKyBgXCIke3Byb3BlcnR5TmFtZX1cIjoke2luZGVudCA/ICcgJyA6ICcnfSR7Y29udGVudH1gXG4gICAgKyAnLCcsXG4gICk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZFZhbHVlSW5Bc3RBcnJheShcbiAgcmVjb3JkZXI6IFVwZGF0ZVJlY29yZGVyLFxuICBub2RlOiBKc29uQXN0QXJyYXksXG4gIHZhbHVlOiBKc29uVmFsdWUsXG4gIGluZGVudCA9IDQsXG4pIHtcbiAgY29uc3QgaW5kZW50U3RyID0gX2J1aWxkSW5kZW50KGluZGVudCk7XG4gIGxldCBpbmRleCA9IG5vZGUuc3RhcnQub2Zmc2V0ICsgMTtcbiAgaWYgKG5vZGUuZWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgIC8vIEluc2VydCBjb21tYS5cbiAgICBjb25zdCBsYXN0ID0gbm9kZS5lbGVtZW50c1tub2RlLmVsZW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGxhc3QuZW5kLm9mZnNldCwgJywnKTtcbiAgICBpbmRleCA9IGluZGVudCA/IGxhc3QuZW5kLm9mZnNldCArIDEgOiBsYXN0LmVuZC5vZmZzZXQ7XG4gIH1cblxuICByZWNvcmRlci5pbnNlcnRSaWdodChcbiAgICBpbmRleCxcbiAgICAobm9kZS5lbGVtZW50cy5sZW5ndGggPT09IDAgJiYgaW5kZW50ID8gJ1xcbicgOiAnJylcbiAgICArICcgJy5yZXBlYXQoaW5kZW50KVxuICAgICsgSlNPTi5zdHJpbmdpZnkodmFsdWUsIG51bGwsIGluZGVudCkucmVwbGFjZSgvXFxuL2csIGluZGVudFN0cilcbiAgICArIGluZGVudFN0ci5zbGljZSgwLCAtaW5kZW50KSxcbiAgKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFByb3BlcnR5SW5Bc3RPYmplY3QoXG4gIG5vZGU6IEpzb25Bc3RPYmplY3QsXG4gIHByb3BlcnR5TmFtZTogc3RyaW5nLFxuKTogSnNvbkFzdE5vZGUgfCBudWxsIHtcbiAgbGV0IG1heWJlTm9kZTogSnNvbkFzdE5vZGUgfCBudWxsID0gbnVsbDtcbiAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBub2RlLnByb3BlcnRpZXMpIHtcbiAgICBpZiAocHJvcGVydHkua2V5LnZhbHVlID09IHByb3BlcnR5TmFtZSkge1xuICAgICAgbWF5YmVOb2RlID0gcHJvcGVydHkudmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG1heWJlTm9kZTtcbn1cblxuZnVuY3Rpb24gX2J1aWxkSW5kZW50KGNvdW50OiBudW1iZXIpOiBzdHJpbmcge1xuICByZXR1cm4gY291bnQgPyAnXFxuJyArICcgJy5yZXBlYXQoY291bnQpIDogJyc7XG59XG4iXX0=