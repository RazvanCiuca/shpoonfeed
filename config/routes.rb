Shpoonfeed::Application.routes.draw do
  resources :users
  resource :session
  resources :aversions
  get "/users/:id/friends", to: "users#friends"
  get "/users/:id/notfriends", to: "users#notfriends"
  get "/befriend", to: "users#befriend"
  get "/defriend", to: "users#defriend"
  root :to => "root#root"
  match "/auth/:provider/callback", to: "sessions#facebook_auth"
end
