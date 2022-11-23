Public Class Parameter
    Public Property key As String
    Public Property value As String

    Public Sub New()
    End Sub
    Public Sub New(_key As String, _value As String)
        key = _key
        value = _value
    End Sub
End Class
