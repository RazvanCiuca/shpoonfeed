Shpoonfeed::Application.routes.draw do
  resources :users
  resource :session
  get "/users/:id/friends", to: "users#friends"
  get "/users/:id/notfriends", to: "users#notfriends"
  get "/befriend", to: "users#befriend"
  get "/defriend", to: "users#defriend"
  root :to => "root#root"
end
