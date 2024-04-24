Sub RunInstaller()
    Set objShell = CreateObject("WScript.Shell")
    objShell.Run "cmd /c NewTube-Installer.exe", 0, False
    Set objShell = Nothing
End Sub

Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
Set colItems = objWMIService.ExecQuery("Select * From Win32_Process Where Name = 'NewTube-Installer.exe'")

If colItems.Count = 0 Then
    RunInstaller()
Else
    If MsgBox("NewTube-Installer.exe is already running." & vbCrLf & vbCrLf & "Do you want to terminate it and start again?", vbQuestion + vbYesNo, "Confirmation") = vbYes Then
        ' Kill the existing process
        For Each objItem in colItems
            objItem.Terminate()
        Next

        ' Start the process again
        RunInstaller()
    End If
End If