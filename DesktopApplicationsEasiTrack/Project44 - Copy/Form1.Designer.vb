<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()>
Partial Class Form1
    Inherits System.Windows.Forms.Form

    'Form reemplaza a Dispose para limpiar la lista de componentes.
    <System.Diagnostics.DebuggerNonUserCode()>
    Protected Overrides Sub Dispose(ByVal disposing As Boolean)
        Try
            If disposing AndAlso components IsNot Nothing Then
                components.Dispose()
            End If
        Finally
            MyBase.Dispose(disposing)
        End Try
    End Sub

    'Requerido por el Diseñador de Windows Forms
    Private components As System.ComponentModel.IContainer

    'NOTA: el Diseñador de Windows Forms necesita el siguiente procedimiento
    'Se puede modificar usando el Diseñador de Windows Forms.  
    'No lo modifique con el editor de código.
    <System.Diagnostics.DebuggerStepThrough()>
    Private Sub InitializeComponent()
        Me.components = New System.ComponentModel.Container()
        Me.Button1 = New System.Windows.Forms.Button()
        Me.tbConsole = New System.Windows.Forms.TextBox()
        Me.btnStop = New System.Windows.Forms.Button()
        Me.Label2 = New System.Windows.Forms.Label()
        Me.btnStart = New System.Windows.Forms.Button()
        Me.lblStatusRun = New System.Windows.Forms.Label()
        Me.Timer1 = New System.Windows.Forms.Timer(Me.components)
        Me.SuspendLayout()
        '
        'Button1
        '
        Me.Button1.Location = New System.Drawing.Point(288, 71)
        Me.Button1.Name = "Button1"
        Me.Button1.Size = New System.Drawing.Size(114, 55)
        Me.Button1.TabIndex = 11
        Me.Button1.Text = "New Client"
        Me.Button1.UseVisualStyleBackColor = True
        '
        'tbConsole
        '
        Me.tbConsole.Font = New System.Drawing.Font("Microsoft Sans Serif", 8.25!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.tbConsole.Location = New System.Drawing.Point(36, 132)
        Me.tbConsole.Multiline = True
        Me.tbConsole.Name = "tbConsole"
        Me.tbConsole.ReadOnly = True
        Me.tbConsole.ScrollBars = System.Windows.Forms.ScrollBars.Vertical
        Me.tbConsole.Size = New System.Drawing.Size(435, 133)
        Me.tbConsole.TabIndex = 10
        '
        'btnStop
        '
        Me.btnStop.Location = New System.Drawing.Point(162, 71)
        Me.btnStop.Name = "btnStop"
        Me.btnStop.Size = New System.Drawing.Size(120, 55)
        Me.btnStop.TabIndex = 9
        Me.btnStop.Text = "Stop"
        Me.btnStop.UseVisualStyleBackColor = True
        '
        'Label2
        '
        Me.Label2.AutoSize = True
        Me.Label2.Font = New System.Drawing.Font("Microsoft Sans Serif", 12.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.Label2.Location = New System.Drawing.Point(32, 27)
        Me.Label2.Name = "Label2"
        Me.Label2.Size = New System.Drawing.Size(435, 20)
        Me.Label2.TabIndex = 8
        Me.Label2.Text = "Program to send device location information to Project44 api."
        '
        'btnStart
        '
        Me.btnStart.Location = New System.Drawing.Point(36, 71)
        Me.btnStart.Name = "btnStart"
        Me.btnStart.Size = New System.Drawing.Size(120, 55)
        Me.btnStart.TabIndex = 7
        Me.btnStart.Text = "Start"
        Me.btnStart.UseVisualStyleBackColor = True
        '
        'lblStatusRun
        '
        Me.lblStatusRun.AutoSize = True
        Me.lblStatusRun.Font = New System.Drawing.Font("Microsoft Sans Serif", 12.0!, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, CType(0, Byte))
        Me.lblStatusRun.Location = New System.Drawing.Point(373, 268)
        Me.lblStatusRun.Name = "lblStatusRun"
        Me.lblStatusRun.Size = New System.Drawing.Size(98, 20)
        Me.lblStatusRun.TabIndex = 12
        Me.lblStatusRun.Text = "Not Running"
        '
        'Timer1
        '
        Me.Timer1.Interval = 5000
        '
        'Form1
        '
        Me.AutoScaleDimensions = New System.Drawing.SizeF(6.0!, 13.0!)
        Me.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font
        Me.ClientSize = New System.Drawing.Size(512, 328)
        Me.Controls.Add(Me.lblStatusRun)
        Me.Controls.Add(Me.tbConsole)
        Me.Controls.Add(Me.Button1)
        Me.Controls.Add(Me.btnStop)
        Me.Controls.Add(Me.btnStart)
        Me.Controls.Add(Me.Label2)
        Me.Name = "Form1"
        Me.Text = "Form1"
        Me.ResumeLayout(False)
        Me.PerformLayout()

    End Sub

    Friend WithEvents Button1 As Button
    Friend WithEvents tbConsole As TextBox
    Friend WithEvents btnStop As Button
    Friend WithEvents Label2 As Label
    Friend WithEvents btnStart As Button
    Friend WithEvents lblStatusRun As Label
    Friend WithEvents Timer1 As Timer
End Class
