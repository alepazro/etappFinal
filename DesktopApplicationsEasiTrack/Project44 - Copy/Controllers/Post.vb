Imports RestSharp

Public Class Post
    Public Function UpdatePositionPost(url As String, headers As List(Of Parameter), json As String) As String

        Dim client = New RestClient(New Uri(url))
        Dim request = New RestRequest()
        request.Method = Method.Post

        For Each item As Parameter In headers
            request.AddHeader(item.key, item.value)
        Next
        request.AddJsonBody(json)
        Dim response0 = client.Execute(request)
        Dim response = response0.Content.ToString()
        Return response
    End Function
    Public Function UpdatePositionPost(url As String, headers As List(Of Parameter), json As UpdatePositionETA) As String

        Dim client = New RestClient(New Uri(url))
        Dim request = New RestRequest()
        request.Method = Method.Post

        For Each item As Parameter In headers
            request.AddHeader(item.key, item.value)
        Next
        request.AddJsonBody(json)

        Dim response = client.Execute(request).Content.ToString()
        Return response
    End Function
    Public Function UpdatePositionPost(url As String, headers As List(Of Parameter), json As UpdatePositionStatusEvent) As String

        Dim client = New RestClient(New Uri(url))
        Dim request = New RestRequest()
        request.Method = Method.Post

        For Each item As Parameter In headers
            request.AddHeader(item.key, item.value)
        Next
        request.AddJsonBody(json)

        Dim response = client.Execute(request).Content.ToString()
        Return response
    End Function
End Class
