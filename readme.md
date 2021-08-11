# JAWS Scripts for Visual Studio Code 

* Author: Travis Roth
* JAWS compatibility: 2021
* [Download current release][3] 
* August 2021

This package of JAWS scripts for [Visual Studio Code][1] (VSCode) enhances JAWS's support for working with VSCode. [JAWS][2] is a screen reader from Freedom Scientific and this documentation assumes the user knows how to use it. 
VSCode has accessibility and continues to improve. In time these JAWS scripts hopefully will not be needed. In the meantime they are here to make certain things more efficient when working in VSCode using JAWS. The primary focus is Python and Jupyter notebooks in VSCode 1.59. As the reader will notice these scripts target current inefficiencies but otherwise provide very little as VSCode does a lot on its own which of course is preferred.

## Features

* Status bar reading: VSCode has a robust status bar and it is already accessible by moving keyboard focus to it. JAWS has long had a feature of SayBottomLineOfWindow or more commonly just called read status bar command that is operable with a keystroke, JAWSKey+PageDown. This script set enables JAWS to locate and read the status bar. An enhancement has also been added to the command to optimize efficiency: the most common information needed when editting is cursor location. When displayed, activating the SayBottomLineOfWindow command will read just this information the first time it is pressed. To read everything on the status bar, press the script key twice quickly. Note: VSCode also provides this information in the Goto dialog box commonly accessible via Ctrl+g. This method is still needed in some cases.
* Overrides JAWS's built-in next and previous paragraph commands (Ctrl+Up/Down arrow) which do not seem effective in VSCode and interfere with some useful extensions that use these keyboard shortcuts such as GotoNext/Previous Member.
* VSCode has a robust Jupyter Notebook editting experience that makes it easy to work with cells. These JAWS scripts add the ability for JAWS to read more descriptive names of code cells than just "Cell 1", etc., that is provided by default. The script adds the first line of a cell's content to the accessible name read to add more content making it easier to navigate the list of cells. Note: this feature does not work with Markdown cells as they are formatted into the web document VSCode uses and not reliably accessible by JAWS thru UIA. The user can always press Enter to open the cell in the editor view and read it. When writing one's own Code cells a way to take advantage of this feature is to put a brief, clear comment as the first line that will in turn serve as the name JAWS reads when navigating the cell list.
* The enhanced cell name in the cell list also is displayed in Braille. 
* Currently the Jupyter output created when a cell is executed is not accessible. It is in the web view, so in theory the user can turn on JAWS virtual cursor and browse the web view to find it but this is very difficult and inefficient. Hopefully in the future VSCode will add native support for keyboard focus on the output, and so forth. For now, these scripts add the ability for JAWS to display the output for the currently selected cell in the cell list in a JAWS virtual buffer. The script shwos either the successful result when available, or the error and traceback information when there was an execution failure.


## Commands

* Read status bar: JAWSKey+PageDown. Once for cursor location information, twice quickly for entire status bar. (Note: it is possible to move keyboard focus to the status bar with F6 and arrow through it which is provided by VSCode. This JAWS script enhancement is for convenience.)
* Display Jupyter Notebook cell output: Ctrl+JAWSKey+o
* Reading and displaying more descriptive names of notebook cells when possible is automatic.

## Issues

* When displaying Jupyter Notebook cell output JAWS sometimes does not say anything when the virtual buffer appears. This especially seems to happen when there is one line of output. It is displayed the user must just Ctrl+Home back to the top of the virtual buffer. 
* Not so much an issue as just a fact, when ouput consists of tables such as printing a Pandas Dataframe this output is textual in nature and table formatting is not provided by VSCode. If it is a big table of output to view perhaps consider exporting it to Excel via your programming skills.

## Installation

From the current release download and unzip the .zip file and copy the JAWS script files to your current user script directory. This is quickly available by choosing the JAWS menu, Utilities, Explore Utilities Folder, Explore My Settings. 
Note: these scripts are English only and will only work with English instances of VSCode. 

## Disclaimer

It is not possible to test on every possible configuration that may be out there. These scripts were tested with JAWS 2021 and VSCode 1.59. Earlier versons of JAWS were not tested and I have no plans to do so. Your results may vary. If they don't' work for you, uninstall them. There should be no residual negative impact. Nevertheless use at your own risk. 

[1]: https://code.visualstudio.com/

[2]: https://www.freedomscientific.com

[3]: https://github.com/travisroth/VSCodeJAWSScripts/releases/download/2021.8.0/VisualStudioCode.zip
