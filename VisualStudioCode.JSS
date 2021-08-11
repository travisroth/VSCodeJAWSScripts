; Visual Studio Code
; copyright (c) 2021 Travis Roth
;This file is covered by the GNU General Public License.

include "hjconst.jsh"
include "hjglobal.jsh"
use  "uia.jsb"
include "uia.jsh"
import "braille.jsd"
use "VisualStudioCode.jsb" ; builtin in JAWS 2021



Object Function getControlTypeStatusBar()
	var object window = fsUIAGetElementFromHandle (getAppMainWindow (getFocus ()))
	if ! window then  return Null () endIf
	var object statusBarCondition = FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_StatusBarControlTypeId )
	var object statusBar = window.FindFirst(treeScope_descendants, statusBarCondition)
	return statusBar
EndFunction

Object Function getStatusBarGroups()
	;the status bar UIA object uses groups
	;the visual text is the name of the group
	var object statusBar = getControlTypeStatusBar()
	if ! statusBar
		say("Status bar not found", OT_NO_DISABLE)
		return
	EndIf
	var object groupControlTypeCondition = FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_GroupControlTypeId )
	var object items = statusBar.FindAll(treeScope_children, groupControlTypeCondition)
	return items
EndFunction

String Function getStatusBarText(int onlyCursorPosition)
	;onlyCursorPosition=true looks for the LN Col info only
	var object items = getStatusBarGroups()
	if ! items then 
		return "Status bar not found" 
	endIf
	var string line
	var string cursorPosition
	var string name
	var object statusItem
	var int i
	for i = 0 to items.count
		statusItem = items(i)
		name = statusItem.Name
		line = line + name + ", "
		if onlyCursorPosition == true
			if StringStartsWith (name, "LN ", false)
				cursorPosition = name
			EndIf
		EndIf
	endFor
	if onlyCursorPosition==true 
		return cursorPosition
	else
		return line
	EndIf
EndFunction

Script SayBottomLineOfWindow ()
	; JAWS  reading status bar
	if IsSameScript () > 0 
			say(getStatusBarText(false), OT_NO_DISABLE)
	else
		say(getStatusBarText(true), OT_NO_DISABLE)
	EndIf
EndScript

Script ControlUpArrow()
	;JAWS's paragraph navigation interferes with Jump to Next Member extension
	TypeCurrentScriptKey ()
	;pausing then performing a script call instead of a sayline() function call seems to add enough delay to get focus to the new line
	pause()
	PerformScript SayLine()
EndScript

Script ControlDownArrow()
	;JAWS's paragraph navigation interferes with Jump to Next Member extension
	TypeCurrentScriptKey ()
	pause()
	PerformScript SayLine()
EndScript

Int Function isInJupyterNotebookList(Object listItem)
	;list boxes are two parents above list items in VSCode
	; object hierarchy is list > group > list item
	;UIA_ListControlTypeId 
	if ! listItem then return false EndIf
	var object parent = FSUIAGetParentOfElement(listItem)
	parent = FSUIAGetParentOfElement(parent)
	var int t = parent.ControlType
	var string name = parent.Name
	if (t == UIA_ListControlTypeId) && (StringContains (name, "Notebook")==true) then return true else return false EndIf
EndFunction

object function getJupyterCell()
	;cells are listbox items in a listbox that gets keyboard focus
	var object cell = FSUIAGetFocusedElement(false)
	if isInJupyterNotebookList(cell) then 
		return cell
	else
		return Null()
	EndIf
EndFunction

String Function getJupyterCellOutputText()
	var object cell = getJupyterCell()
	if ! cell then return "" EndIf
	var object textControlTypeCondition = FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_TextControlTypeId )
	;successful output is in text items under the cell list item in UIA hierarchy
	var object items = cell.FindAll(treeScope_children, textControlTypeCondition )
	if  items.count < 2 then 
		;look for failed output
		; failures are in text controls but under 
		; list (Notebook) > Pane > Document (Virtual Document) > Document > Pane > document

		;move up to Notebook list object level
		var object parent = FSUIAGetParentOfElement(cell)
		parent = FSUIAGetParentOfElement(parent)
		;move to first document leve seems to be enough to only capture error texts but if stay at parent level also get some previous outputs 
		;if notebook complexity and output expands this may need further refinement
		var object documentCondition = FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_DocumentControlTypeId) 
		var object document = parent.FindFirst(TreeScope_Descendants, documentCondition)
		items = document.FindAll(TreeScope_Descendants, textControlTypeCondition )
	EndIf ;look for failures

	if items.count > 1 then
		var string text = ""
		var string name
		var int i = 1
		var object o
		; items(0) is a number in brackets that I don't see a use for, skipping
		for i = 1 to items.count
			o = items(i)
			name = o.Name
			text = text + name + " "
		EndFor
		return text
	EndIf
	return "" 
EndFunction

String Function getJupyterCellEditorContent()
	var object cell = getJupyterCell()
	if ! cell then return "" EndIf
	var object editTypeCondition = FSUIACreateIntPropertyCondition( UIA_ControlTypePropertyId, UIA_EditControlTypeId )
	var object editor = cell.FindFirst(treeScope_descendants, editTypeCondition )
	if  editor then 
		;uia.jss uses this method and it works here
		var object range = editor.GetTextPattern().DocumentRange()
		if !range return "" endIf
		return range.GetText(TextRange_NoMaxLength)

	else
		/* experimental but JAWS 2021 and VSCode 1.59 only work on some headings and where doesn't work gets to sluggish to use
		; markdown cells once processed do not have an editor object in view mode
		; try to find  aheading 
		var object headingCondition = 	FSUIACreateStringPropertyCondition(UIA_ARIARolePropertyID, "heading")
		var object treeWalker = FSUIACreateTreeWalker(headingCondition)
		treeWalker.currentElement = cell
		if treeWalker.gotoNextSibling() then 
		var object content = treeWalker.currentElement
	return content.Name 
	else 
		return "cannot treeWalk" 
	EndIf
*/
	EndIf ;editor or not
return ""
EndFunction


Script ShowJupyterCellOutput ()
	;ctrl+jawsKey+o
	var string text = getJupyterCellOutputText()
	if !StringIsBlank (text) then
		sayMessage(OT_USER_BUFFER, text )
		; tested if HTML output could be formatted such as tables but didn't' work:
		;text = stringChopLeft (text, 2)
		;text = stringChopRight (text, 3) 
		;UserBufferClear ()
		;UserBufferAddTextWithHTML (text, false  )
		;UserBufferActivate (true)
	else
		say("Output not found", OT_USER_REQUESTED_INFORMATION)
	EndIf
EndScript



void Function SayObjectTypeAndText (int position, int arg, int visual)
	if GetObjectSubTypeCode (true, 0) == 55 then
		if isInJupyterNotebookList(getJupyterCell()) == true then
			var string name = GetObjectName (true, 0)
			var string cellContent  = getJupyterCellEditorContent()
			;capture first line
			var variant line = StringSegment (cellContent, "\n", 1)
			if ! StringIsBlank (line) then
				say(name, OT_SELECTED_ITEM)
				say( line, OT_SELECTED_ITEM)

			else
				say(name, OT_SELECTED_ITEM)
			EndIf ;stringIsBlank
		else
			return SayObjectTypeAndText (position, arg, visual)
		EndIf ;isInJupyterNotebookList
	else
		return SayObjectTypeAndText (position, arg, visual)
	EndIf ; not a list item
EndFunction

int function BrailleAddObjectName (int nSubtypeCode)
	if GetObjectSubTypeCode (true, 0) == 55 then
		if isInJupyterNotebookList(getJupyterCell()) == true then
			var string name = GetObjectName (true, 0)
			var string cellContent  = getJupyterCellEditorContent()
		;capture first line
		var string line = StringSegment (cellContent, "\n", 1)
		if ! StringIsBlank (line) then
			var string displayThis = name 
			displayThis = displayThis  + " " + line
			BrailleAddString(displayThis, 0,0,0)
			return true
		else
			return BrailleAddObjectName (nSubtypeCode)
		EndIf ;stringIsBlank
	else
		return BrailleAddObjectName ( nSubtypeCode)
	EndIf ;isInJupyterNotebookList(
	else
		return BrailleAddObjectName ( nSubtypeCode)
	EndIf ; not list item

EndFunction


Script SayLine ()
	if GetObjectSubTypeCode (true, 0) == 55 then
		if isInJupyterNotebookList(getJupyterCell()) == true then
		SayObjectTypeAndText (0, 0, 0)
		else
		PerformScript SayLine()
	EndIf
	else
		PerformScript SayLine()
	EndIf

EndScript
