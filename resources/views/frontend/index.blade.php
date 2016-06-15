@extends('layouts.frontend')

@section('content')
  <div class="container">
    <div class="row">
      <div class="col-md-10 col-md-offset-1">
        <div class="panel panel-default">
          <div class="panel-heading">Welcome</div>

          <div class="panel-body">
            Your Application's Landing Page.

            @can('manage_content')
            <a href="#">Can manage</a>
            @endcan

            @can('delete_content')
            <a href="#">Can delete</a>
            @endcan

          </div>
        </div>
      </div>
    </div>
  </div>
@endsection
