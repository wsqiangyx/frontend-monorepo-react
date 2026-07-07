import { View, Text } from '@tarojs/components'
import { useAuthStore } from '@/stores/auth'
import './index.scss'

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  return (
    <View className="index">
      <Text className="index-welcome">Taro MiniApp</Text>
      <Text className="index-status">{isAuthenticated ? '已登录' : '未登录'}</Text>
    </View>
  )
}
